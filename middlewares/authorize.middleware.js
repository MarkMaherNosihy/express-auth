const authorizationMiddlware = (role) => {
    return (req, res, next) => {
    const user = req.user;
    if (!role.includes(user.role)) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
        next();
    }
}

module.exports = authorizationMiddlware;
