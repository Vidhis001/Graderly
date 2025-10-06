import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  
  console.log('Auth header:', header);
  console.log('Token present:', !!token);
  
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'changeme');
    console.log('Token verified for user:', payload);
    req.user = payload;
    return next();
  } catch (err) {
    console.log('Token verification failed:', err.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}

export function requireRole(role) {
  return function roleMiddleware(req, res, next) {
    if (!req.user || req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
    return next();
  };
}


