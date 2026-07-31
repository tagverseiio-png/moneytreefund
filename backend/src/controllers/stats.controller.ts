import { Request, Response } from 'express';
import { db } from '../firebase/admin';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    if (req.user?.role !== 'Admin' && req.user?.role !== 'Super Admin' && req.user?.role !== 'Administrator') {
       return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const clientsSnapshot = await db.collection('clients').get();
    const documentRequestsSnapshot = await db.collection('document_requests').where('status', '==', 'Pending').get();

    return res.status(200).json({
      success: true,
      data: {
        totalClients: clientsSnapshot.size,
        activeTrusts: 0, // Not implemented yet
        pendingDocuments: documentRequestsSnapshot.size,
        recentActivity: 0 // Not implemented yet
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
