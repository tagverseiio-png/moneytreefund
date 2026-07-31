import { Request, Response } from 'express';
import { db } from '../firebase/admin';

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userId = req.user.uid;
    const userDoc = await db.collection('users').doc(userId).get();
    
    let role = 'Client';
    let userData = {};

    if (userDoc.exists) {
      const data = userDoc.data();
      role = data?.role || 'Client';
      userData = data || {};
    }

    return res.status(200).json({
      success: true,
      message: 'User details fetched successfully',
      data: {
        uid: userId,
        email: req.user.email,
        role: role,
        ...userData
      }
    });
  } catch (error) {
    console.error('Error fetching user info:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
