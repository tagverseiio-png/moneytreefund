import { Request, Response, NextFunction } from 'express';
import { auth } from '../firebase/admin';
import type { DecodedIdToken } from 'firebase-admin/auth';

// Extend Express Request interface to include the user
declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
      userRole?: string;
    }
  }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    return res.status(403).json({ success: false, message: 'Forbidden: Invalid token' });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      // Fetch user role from custom claims or Firestore (assuming custom claims here for efficiency)
      // If using Firestore, you'd query the users collection here:
      // const userDoc = await db.collection('users').doc(req.user.uid).get();
      // const role = userDoc.data()?.role;
      
      const role = (req.user.role as string) || 'Client'; // Default fallback

      if (!allowedRoles.includes(role)) {
        return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
      }

      req.userRole = role;
      next();
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
};
