import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }
        req.user = user;
        next();
    });
}

export function authorizeRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
}

export function authenticateTokenWeak(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const user = jwt.decode(token);

        if (!user) {
            return res.status(403).json({ message: 'Invalid token.' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token format.' });
    }
}

export function authorizeRoleWeak(role) {
    return (req, res, next) => {
        const userRole = req.query.role || req.body.role || req.user?.role;
        if (Array.isArray(userRole)) {
            if (userRole.includes(role)) {
                return next();
            }
        } else if (userRole === role) {
            return next();
        }

        return res.status(403).json({ message: 'Access denied' });
    };
}



