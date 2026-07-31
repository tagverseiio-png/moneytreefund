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

export const approveClient = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    if (req.user?.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    await db.collection('users').doc(id).update({ status: 'Active' });
    await db.collection('clients').doc(id).update({ status: 'Active' });

    return res.status(200).json({ success: true, message: 'Client approved successfully' });
  } catch (error) {
    console.error('Error approving client:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getClientRequests = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    // Admin can see any, Client can only see their own
    if (req.user?.role !== 'Admin' && req.user?.uid !== id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const snapshot = await db.collection('document_requests')
      .where('clientId', '==', id)
      .orderBy('createdAt', 'desc')
      .get();
      
    const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const createDocumentRequest = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, description } = req.body;

    if (req.user?.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const reqRef = db.collection('document_requests').doc();
    const reqData = {
      id: reqRef.id,
      clientId: id,
      title,
      description: description || '',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      createdBy: req.user.uid
    };

    await reqRef.set(reqData);

    return res.status(201).json({ success: true, message: 'Request created', data: reqData });
  } catch (error) {
    console.error('Error creating request:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

