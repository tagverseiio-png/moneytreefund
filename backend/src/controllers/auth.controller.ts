import { Request, Response } from 'express';
import { db, auth } from '../firebase/admin';
import axios from 'axios';

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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const apiKey = process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY;
    if (!apiKey) {
      throw new Error('Firebase API key not configured on backend.');
    }

    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        email,
        password,
        returnSecureToken: true
      }
    );

    const idToken = response.data.idToken;
    
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    
    res.cookie('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none'
    });

    return res.status(200).json({ success: true, message: 'Logged in successfully' });
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const sessionCookie = req.cookies.session || '';
    res.clearCookie('session');
    
    if (sessionCookie) {
      try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie);
        await auth.revokeRefreshTokens(decodedClaims.sub);
      } catch (err) {
        // Token might already be expired/invalid, safe to ignore during logout
      }
    }
    
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
