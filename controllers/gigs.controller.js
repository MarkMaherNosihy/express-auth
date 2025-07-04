const gigsService = require('../services/gigs.service');


exports.createGig = async (req, res) => {
    try {
        const gig = await gigsService.createGig(req.body, req.user.id);
        res.status(201).json(gig);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getGigs = async (req, res) => {
    try {
        const gigs = await gigsService.getGigs(req.user.id);
        res.status(200).json(gigs);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


