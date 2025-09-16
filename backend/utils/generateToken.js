const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '30d'});

    // set jwt as httpOnly cookie
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: new Date(Date.now() + 30*24*60*60*1000),
    });
}

module.exports = generateToken;