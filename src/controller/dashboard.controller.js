import { prisma } from '../../prismaConfig.js';

// Fields exposed on every card — nothing private
const CARD_SELECT = {
    id: true,
    firstName: true,
    lastName: true,
    username: true,
    profilePictureThumbnailUrl: true,
    mood: true,
    experience: true,
    skills: true,
    portfolio: true,
    github: true,
    linkedIn: true,
    discord: true,
    createdAt: true,
};

const dashboard_controller = async (req, res) => {
    try {
        // --- Pagination ---
        const page  = Math.max(1, parseInt(req.query.page)  || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));
        const skip  = (page - 1) * limit;

        // --- Filters ---
        const { experience, mood } = req.query;

        // Base where — always exclude self, banned users, unverified users
        const where = {
            id:         { not: req.userId },
            isBanned:   false,
            isVerified: true,
        };

        // experience filter — single value e.g. ?experience=SENIOR
        if (experience) {
            const valid = ['JUNIOR', 'MID_LEVEL', 'SENIOR', 'EXPERT'];
            if (!valid.includes(experience)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid experience value. Must be one of: ${valid.join(', ')}`,
                });
            }
            where.experience = experience;
        }

        // mood filter — single value e.g. ?mood=FREELANCE
        if (mood) {
            const valid = ['PART_TIME', 'FULL_TIME', 'FREELANCE'];
            if (!valid.includes(mood)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid mood value. Must be one of: ${valid.join(', ')}`,
                });
            }
            where.mood = mood;
        }


        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: CARD_SELECT,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.user.count({ where }),
        ]);

        return res.status(200).json({
            success: true,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1,
            },
            users,
        });
    } catch (err) {
        console.log('Error in dashboard_controller :', err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong on the server',
        });
    }
};

export { dashboard_controller };