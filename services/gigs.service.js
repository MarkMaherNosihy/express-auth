const prisma = require('../prisma/client');

exports.createGig = async (gigData, userId) => {
    const gig = await prisma.gig.create({
        data: {
            ...gigData,
            userId: parseInt(userId)
        }
    })
    return gig;
}

exports.getGigs = async (userId) => {
    const gigs = await prisma.gig.findMany({
        where: {
            userId: parseInt(userId),
            isActive: true,
            isDeleted: false
        }
    })
    return gigs;
}
