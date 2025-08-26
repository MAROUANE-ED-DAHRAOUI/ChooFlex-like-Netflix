const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In production, replace with actual database lookup
const ADMIN_USER = { 
  username: process.env.ADMIN_USERNAME || 'admin', 
  password: process.env.ADMIN_PASSWORD || 'admin123',
  role: 'admin'
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    // Check credentials
    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
      const token = jwt.sign(
        { 
          username: username,
          role: ADMIN_USER.role 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '8h' }
      );
      
      return res.json({ 
        token,
        user: {
          username: username,
          role: ADMIN_USER.role
        }
      });
    }
    
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.logout = (req, res) => {
  // Client should remove token; nothing to do server-side for stateless JWT
  res.json({ message: 'Successfully logged out' });
};

exports.session = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ 
      user: {
        username: decoded.username,
        role: decoded.role
      }
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
};
