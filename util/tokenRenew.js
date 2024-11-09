import jwt from 'jsonwebtoken';

export const renewToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const newToken = jwt.sign({
                id: decoded.userID,
                role: decoded.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.setHeader('Authorization', `Bearer ${newToken}`);
        
        req.newToken = newToken;

        next();
    }
    
    catch (error) {
        console.log(`Token renewal failed: ${error}`);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};