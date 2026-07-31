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
    let status = 'Pending';
    let userData = {};

    if (userDoc.exists) {
      const data = userDoc.data();
      role = data?.role || 'Client';
      status = data?.status || 'Pending';
      userData = data || {};
    }

    return res.status(200).json({
      success: true,
      message: 'User details fetched successfully',
      data: {
        uid: userId,
        email: req.user.email,
        role,
        status,
        ...userData
      }
    });
  } catch (error) {
    console.error('Error fetching user info:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    // 1. Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    const uid = userRecord.uid;

    // 2. Set user role and Pending status in `users` collection
    await db.collection('users').doc(uid).set({
      email,
      name,
      role: 'Client',
      status: 'Pending',
      createdAt: new Date().toISOString()
    });

    // 3. Set client metadata in `clients` collection
    const clientData = {
      name,
      email,
      id: uid,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      createdBy: 'self-signup'
    };

    await db.collection('clients').doc(uid).set(clientData);

    return res.status(201).json({
      success: true,
      message: 'Signup successful. Account is pending approval.'
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return res.status(400).json({ success: false, message: error.message || 'Failed to sign up' });
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
      secure: true,
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
