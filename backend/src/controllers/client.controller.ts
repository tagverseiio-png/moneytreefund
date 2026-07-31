import { Request, Response } from 'express';
import { db, auth } from '../firebase/admin';

export const createClient = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    
    if (!data.name || !data.email || !data.password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    // 1. Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.name,
    });

    const uid = userRecord.uid;

    // 2. Set user role in `users` collection for auth
    await db.collection('users').doc(uid).set({
      email: data.email,
      name: data.name,
      role: 'Client',
      createdAt: new Date().toISOString()
    });

    // 3. Set client metadata in `clients` collection
    const clientData = {
      name: data.name,
      email: data.email,
      id: uid,
      createdAt: new Date().toISOString(),
      createdBy: req.user?.uid || 'system'
    };

    await db.collection('clients').doc(uid).set(clientData);

    return res.status(201).json({
      success: true,
      message: 'Client user created successfully',
      data: clientData
    });
  } catch (error) {
    console.error('Error creating client:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getClients = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('clients').orderBy('createdAt', 'desc').get();
    const clients = snapshot.docs.map(doc => doc.data());

    return res.status(200).json({
      success: true,
      message: 'Clients fetched successfully',
      data: clients
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
