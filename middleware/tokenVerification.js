import jwt from 'jsonwebtoken';

import { renewToken } from '../util/tokenRenew.js';

export const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies.userToken;
    
        if (!token) {
            return res.status(403).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const currTime = Math.floor(Date.now() / 1000)
        
        if (decoded.exp && decoded.exp - currTime <= 300) {
            const newToken = renewToken(decoded);

            res.cookie('userToken', newToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            })

            req.user = newToken;
        } else {
            req.user = decoded;
        }

        next();
    }
    
    catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};