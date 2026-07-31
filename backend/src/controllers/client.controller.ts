import { Request, Response } from 'express';
import { db } from '../firebase/admin';

export const createClient = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    
    // In a real app, use zod or joi for validation here
    if (!data.name || !data.email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const clientRef = db.collection('clients').doc();
    const clientData = {
      ...data,
      id: clientRef.id,
      createdAt: new Date().toISOString(),
      createdBy: req.user?.uid || 'system'
    };

    await clientRef.set(clientData);

    return res.status(201).json({
      success: true,
      message: 'Client created successfully',
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
