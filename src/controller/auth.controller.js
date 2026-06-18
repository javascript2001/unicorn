import dotenv from 'dotenv';
dotenv.config();
import z, { success } from "zod";
import { prisma } from '../../prismaConfig.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifyMailQueue, verifySuccessQueue, forgotPasswordQueue, passwordChangeQueue, twoFactorEnableDisableQueue, sendOtpQueue } from '../queue/queue.js';
import fs from 'fs'
import ImageKit from '@imagekit/nodejs'
import path from 'path';
import { Redis } from "ioredis"
import { redisConnection, redisOption } from '../redis/conncetion.js'
import { use } from 'react';


const redis = new Redis(redisOption);

const __dirname = import.meta.dirname;

const register_schema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    username: z.string(),
    mail: z.string().email(),
    password: z.string(),
    dob: z.string(),
    mobile: z.string().optional(),
    linkedIn: z.string().url(),
    github: z.string().url(),
    portfolio: z.string().url().optional(),
    discord: z.string().url().optional(),
    skills: z.array(z.string()),
    experience: z.enum(["JUNIOR", "MID_LEVEL", "SENIOR", "EXPERT"]),
    mood: z.enum(["PART_TIME", "FULL_TIME", "FREELANCE"]),
})


const register_controller = async (req, res) => {
    const result = register_schema.safeParse(req.body);
    if (!result.success) {
        console.log("Error in JSON BODY", result.error);
        return res.status(400).json({
            success: false,
            error: result.error.errors,
            message: 'Invalid request body'
        });
    }
    try {


        if (await prisma.user.findUnique({ where: { username: result.data.username } })) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
        }
        if (await prisma.user.findUnique({ where: { mail: result.data.mail } })) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }
        const hashedPassword = await bcrypt.hash(result.data.password, 10);
        result.data.password = hashedPassword;
        const user = await prisma.user.create({
            data: {
                ...result.data
            }
        })
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log(`I am token :${token}`);
        res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });
        await verifyMailQueue.add('verify-mail-queue', { token: token, mail: result.data.mail });
        console.log("new mail added in queue");
    } catch (err) {
        console.log('Error in register controller :', err);
        return res.status(500).json({
            success: false,
            message: "something went wrong in server",
            error: err
        })
    }
}

const login_schema = z.object({
    username: z.string().optional(),
    password: z.string(),
    mail: z.string().email().optional(),
})

const login_controller = async (req, res) => {
    const result = login_schema.safeParse(req.body);
    if (!result.success) {
        console.log("Error in JSON BODY", result.error);
        return res.status(400).json({
            success: false,
            error: result.error.errors,
            message: 'Invalid request body'
        });
    }
    if (!result.data.username && !result.data.mail) {
        return res.status(400).json({
            success: false,
            message: 'Username or email is required'
        });
    }
    try {
        const username_or_mail = result.data.username ? { username: result.data.username } : { mail: result.data.mail };
        const user = await prisma.user.findFirst({
            where: {
                ...username_or_mail
            }
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Username or Password'
            });
        }
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email before logging in'
            });
        }
        const isPasswordValid = await bcrypt.compare(result.data.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Username or Password'
            });
        }
        if (user.isBanned) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been banned.'
            });
        }
        if (user.isTwoFactorEnabled) {
            const otp = Math.floor(100000 + Math.random() * 900000);
            await redis.setex(`otp:${user.mail}`, 600, otp); // Store OTP in Redis with a 10-minute expiration
            console.log(`Generated OTP for ${user.mail}: ${otp}`);
            await sendOtpQueue.add('send-otp-queue', { mail: user.mail, otp: otp });
            return res.status(200).json({
                success: true,
                message: 'OTP sent to your email. Please verify to complete login.',
            });
        }
        delete user.password;
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ success: true, message: 'Login successful', user: user });
    } catch (err) {
        console.log('Error in login controller :', err);
        return res.status(500).json({
            success: false,
            message: "something went wrong in server",
            error: err
        })
    }
}

const verify_controller = async (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Token is required'
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        await prisma.user.update({
            where: { id: userId },
            data: { isVerified: true }
        });
        await verifySuccessQueue.add('verify-success-queue', { mail: (await prisma.user.findUnique({ where: { id: userId } })).mail });
        return res.sendFile('verify.html', { root: 'public' });
    } catch (err) {
        console.log('Error in verify controller :', err);
        return res.sendFile('fail.html', { root: 'public' });
    }
}


const resend_verification_controller = async (req, res) => {
    const { mail } = req.body;
    if (!mail) {
        return res.status(400).json({
            success: false,
            message: 'Email is required'
        });
    }
    try {
        const user = await prisma.user.findUnique({ where: { mail: mail } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email is already verified'
            });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log(`I am token :${token}`);
        await verifyMailQueue.add('verify-mail-queue', { token: token, mail: mail });
        return res.status(200).json({
            success: true,
            message: 'mail sent successfully'
        });
    } catch (err) {
        console.log('Error in resend verification controller :', err);
        return res.status(500).json({
            success: false,
            message: "something went wrong in server",
            error: err
        })
    }
}

const logout_controller = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "Logout succefully"
    })

}

const profilePicture_controller = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "File is requried"
        })
    }
    const file_path = path.resolve(req.file.path);
    try {
        const client = new ImageKit({
            privateKey: process.env.IMG_KIT_PRIVAET_KEY
        });
        const uplaod_img = await client.files.upload({
            file: fs.createReadStream(file_path),
            fileName: req.file.filename
        });
        if (uplaod_img.url && uplaod_img.thumbnailUrl) {
            const user = await prisma.user.update({
                where: {
                    id: req.userId
                }, data: {
                    profilePictureUrl: uplaod_img.url,
                    profilePictureThumbnailUrl: uplaod_img.thumbnailUrl
                }
            })
            if (fs.existsSync(file_path)) {
                fs.unlinkSync(file_path);
            }
            return res.status(200).json({
                success: true,
                message: "Profile picture uploaded successfully",
                profilePictureUrl: uplaod_img.url,
                profilePictureThumbnailUrl: uplaod_img.thumbnailUrl
            })
        } else {
            if (fs.existsSync(file_path)) {
                fs.unlinkSync(file_path);
            }
            console.log("Error in uploading image to imagekit");
            return res.status(500).json({
                success: false,
                message: "Error in uploading image to imagekit"
            });
        }
    } catch (err) {
        if (fs.existsSync(file_path)) {
            fs.unlinkSync(file_path);
        }
        console.log("Something went wrong in profile img controller");
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err
        })
    }

}

const forgot_password_request_schema = z.object({
    mail: z.string().email()
})

const forgot_password_requests_controller = async (req, res) => {
    const { mail } = req.body;
    if (!mail) {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        })
    }
    const result = forgot_password_request_schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: "Invalid mail format"
        })
    }
    if (!result.data.mail) {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        })
    }

    try {
        const user = await prisma.user.findUnique({ where: { mail: result.data.mail } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await prisma.user.update({
            where: { id: user.id },
            data: { forgotPasswordToken: token }
        });
        await forgotPasswordQueue.add('forgot-password-queue', { token: token, mail: result.data.mail });
        console.log("I am forgot password token : ", token);
        return res.status(200).json({
            success: true,
            message: "Forgot password mail sent successfully"
        })
    } catch (err) {
        clog('Error in forgot password request controller :', err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err
        })
    }
}
const reset_password_request_schema = z.object({
    oldPassword: z.string(),
    newPassword: z.string()
})

const reset_password_controller = async (req, res) => {
    const result = reset_password_request_schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: "Invalid request body",
            error: result.error.errors
        })
    }
    try {
        const user = await prisma.user.findUnique({ where: { id: req.userId } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const isPasswordValid = await bcrypt.compare(result.data.oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Old Password'
            });
        }
        const hashedPassword = await bcrypt.hash(result.data.newPassword, 10);
        await prisma.user.update({
            where: { id: req.userId },
            data: { password: hashedPassword }
        });
        await passwordChangeQueue.add('change-password-queue', { mail: user.mail });
        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })

    } catch (err) {
        console.log('Error in reset password controller :', err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err
        })
    }
}
const enable_disable_2fa_controller = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.userId } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const newStatus = !user.isTwoFactorEnabled;
        await prisma.user.update({
            where: { id: req.userId },
            data: { isTwoFactorEnabled: newStatus }
        });
        await twoFactorEnableDisableQueue.add('enable-disable-queue', { mail: user.mail, status: newStatus ? "enabled" : "disabled" });
        return res.status(200).json({
            success: true,
            message: `2FA ${newStatus ? "enabled" : "disabled"} successfully`
        })
    } catch (err) {
        console.log('Error in enable/disable 2FA controller :', err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err
        })
    }

}

const send_forgot_password_static_file_controller = async (req, res) => {
    return res.sendFile(path.join(__dirname, "..", "..", 'public', 'forgotpassword.html'));
}

const forgot_password_schema = z.object({
    token: z.string(),
    newPassword: z.string()
})

const forgot_password_controller = async (req, res) => {
    const result = forgot_password_schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: "Invalid request body",
            error: result.error.errors
        })
    }
    try {
        const decoded = jwt.verify(result.data.token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (user.forgotPasswordToken !== result.data.token) {
            return res.status(400).json({
                success: false,
                message: "Invalid token"
            });
        }
        const hashedPassword = await bcrypt.hash(result.data.newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword, forgotPasswordToken: null }
        });
        await passwordChangeQueue.add('change-password-queue', { mail: user.mail });
        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })
    } catch (err) {
        console.log('Error in forgot password controller :', err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err
        })
    }
}


const login_2fa_schema = z.object({
    mail: z.string().email(),
    otp: z.string()
})


const login_2fa_controller = async (req, res) => {
    const result = login_2fa_schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: "Invalid request body",
            error: result.error.errors
        })
    }
    try {
        const user = await prisma.user.findUnique({ where: { mail: result.data.mail } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (!user.isTwoFactorEnabled) {
            return res.status(400).json({
                success: false,
                message: "2FA is not enabled for this user"
            });
        }
        if (!user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Please Verify you mail before login"
            })
        }
        if (user.isBanned) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been banned.'
            });
        }
        if (storedOtp !== result.data.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }
        if (user.mail !== result.data.mail) {
            return res.status(400).json({
                success: false,
                message: "Email does not match with user"
            });
        }

        await redis.del(`otp:${result.data.mail}`); // Delete OTP after successful verification
        delete user.password;
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ success: true, message: 'Login successful', user: user });
    } catch (err) {
        console.log('Error in login 2FA controller :', err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err
        })
    }
}


const resend_otp_controller = async (req, res) => {
    const { mail } = req.body;
    if (!mail) {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        })
    }
    try {
        const user = await prisma.user.findUnique({ where: { mail: mail } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (!user.isTwoFactorEnabled) {
            return res.status(400).json({
                success: false,
                message: "2FA is not enabled for this user"
            });
        }
        if (user.isBanned) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been banned.'
            });
        }
        if (user.isVerified) {
            if (user.mail !== mail) {
                return res.status(400).json({
                    success: false,
                    message: "Email does not match with user"
                });
            }
            if (await redis.get(`otp:${user.mail}`)) {
                await sendOtpQueue.add('send-otp-queue', { mail: user.mail, otp: otp });
                return res.status(200).json({
                    success: true,
                    message: "OTP already sent. Please check your email."
                });
            }
            const otp = Math.floor(100000 + Math.random() * 900000);
            await redis.setex(`otp:${user.mail}`, 600, otp); // Store OTP in Redis with a 10-minute expiration
            console.log(`Generated OTP for ${user.mail}: ${otp}`);
            await sendOtpQueue.add('send-otp-queue', { mail: user.mail, otp: otp });
            return res.status(200).json({
                success: true,
                message: 'OTP resent to your email. Please verify to complete login.',
            });
        }

    } catch (err) {
        console.log('Error in resend OTP controller :', err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: err
        })
    }
}

export { register_controller, login_controller, verify_controller, resend_verification_controller, logout_controller, profilePicture_controller, forgot_password_requests_controller, reset_password_controller, enable_disable_2fa_controller, send_forgot_password_static_file_controller, forgot_password_controller, login_2fa_controller, resend_otp_controller };