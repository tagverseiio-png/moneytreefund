import { Request, Response, NextFunction } from 'express';
import { auth, db } from '../firebase/admin';
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
  const sessionCookie = req.cookies.session || '';

  if (!sessionCookie) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No session cookie provided' });
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true /** checkRevoked */);
    req.user = decodedClaims;
    next();
  } catch (error) {
    console.error('Error verifying Firebase session cookie:', error);
    return res.status(403).json({ success: false, message: 'Forbidden: Invalid or expired session' });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      // Fetch user role from Firestore
      const userDoc = await db.collection('users').doc(req.user.uid).get();
      const role = userDoc.exists ? userDoc.data()?.role : 'Client';

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
