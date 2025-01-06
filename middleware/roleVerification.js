import jwt from 'jsonwebtoken';

export const verifyStudent = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies.userToken;
    
        if (!token) {
            return res.status(403).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(decoded.role != 'Student')
            return res.status(403).json({ message: 'Access denied. You are not a student' });
        
        req.user = decoded;
        
        next();
    }
    
    catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export const verifyTeacher = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies.userToken;
    
        if (!token) {
            return res.status(403).json({ message: 'Access denied. No token provided.' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if(decoded.role != 'Teacher')
            return res.status(403).json({ message: 'Access denied. You are not a teacher' });
        
        req.user = decoded;
        
        next();
    }
    
    catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export const verifyManager = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies.userToken;
        
        if (!token) {
            return res.status(403).json({ message: 'Access denied. No token provided.' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if(decoded.role != 'Manager')
            return res.status(403).json({ message: 'Access denied. You are not a manager' });
        
        req.user = decoded;
        
        next();
    }
    
    catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export const verifyAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies.userToken;
        
        if (!token) {
            return res.status(403).json({ message: 'Access denied. No token provided.' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if(decoded.role != 'Admin')
            return res.status(403).json({ message: 'Access denied. You are not Admin' });
        
        req.user = decoded;
        
        next();
    }
    
    catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};