import jwt from 'jsonwebtoken';

export function login(req, res) {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
        return res.json({ token });
    }
    res.status(401).json({ message: 'Invalid credentials' });
}
