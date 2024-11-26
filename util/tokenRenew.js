import jwt from 'jsonwebtoken';

export const renewToken = (payload) => {
    try {
        const newToken = jwt.sign(payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return newToken;
    }
    
    catch (error) {
        console.log(`Token renewal failed: ${error}`);
        return null;
    }
};