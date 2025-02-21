import jwt from 'jsonwebtoken';

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access Denied');

    const tokenBody = token.split(' ')[1];
    jwt.verify(tokenBody, process.env.JWT_SECRET, { algorithms: ['HS256'] }, (err, user) => {
        if (err) return res.status(403).send('Invalid Token');
        req.user = user;
        next();
    });
}

function authorizeRole(role) {
    return (req, res, next) => {
        console.log(`User role: ${req.user.role}, Required role: ${role}`);
        if (req.user.role !== role) {
            return res.status(403).send('Forbidden');
        }
        next();
    };
}


export { authenticateToken, authorizeRole };
