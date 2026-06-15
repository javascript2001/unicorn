import z from 'zod';
import { prisma } from '../../prismaConfig.js';

const settings_schema = z.object({
    firstName:  z.string().min(1).optional(),
    lastName:   z.string().min(1).optional(),
    username:   z.string().min(3).optional(),
    dob:        z.string().optional(),
    mobile:     z.string().optional(),
    linkedIn:    z.string().url().optional(),
    github:      z.string().url().optional(),
    portfolio:   z.string().url().optional(),
    discord:     z.string().optional(),
    coreSkills:  z.array(z.string()).optional(),
    stackSkills: z.array(z.string()).optional(),
    experience:  z.enum(['JUNIOR', 'MID_LEVEL', 'SENIOR', 'EXPERT']).optional(),
    mood:        z.enum(['PART_TIME', 'FULL_TIME', 'FREELANCE']).optional(),
});

const update_profile_controller = async (req, res) => {
    const result = settings_schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: 'Invalid request body',
            errors: result.error.errors,
        });
    }

    if (Object.keys(result.data).length === 0) {
        return res.status(400).json({
            success: false,
            message: 'No fields provided to update',
        });
    }

    try {
        if (result.data.username) {
            const existing = await prisma.user.findUnique({
                where: { username: result.data.username },
            });
            if (existing && existing.id !== req.userId) {
                return res.status(409).json({
                    success: false,
                    message: 'Username is already taken',
                });
            }
        }

        const updated = await prisma.user.update({
            where: { id: req.userId },
            data: { ...result.data },
        });

        const { password, isVerified, isBanned, role, ...safeUser } = updated;

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: safeUser,
        });
    } catch (err) {
        console.log('Error in update_profile_controller :', err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong on the server',
        });
    }
};

const get_profile_controller = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const { password, isVerified, isBanned, role, ...safeUser } = user;

        return res.status(200).json({
            success: true,
            user: safeUser,
            message: "User details fetched"
        });
    } catch (err) {
        console.log('Error in get_profile_controller :', err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong on the server',
        });
    }
};

export { update_profile_controller, get_profile_controller };
