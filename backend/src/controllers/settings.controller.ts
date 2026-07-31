import { Request, Response } from 'express';
import { db } from '../firebase/admin';

export const getLayouts = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('document_layouts').orderBy('createdAt', 'desc').get();
    const layouts = snapshot.docs.map(doc => doc.data());

    return res.status(200).json({
      success: true,
      message: 'Layouts fetched successfully',
      data: layouts
    });
  } catch (error) {
    console.error('Error fetching layouts:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const createLayout = async (req: Request, res: Response) => {
  try {
    const { name, requiredDocs } = req.body;
    
    if (!name || !Array.isArray(requiredDocs)) {
      return res.status(400).json({ success: false, message: 'Name and requiredDocs array are required' });
    }

    const layoutRef = db.collection('document_layouts').doc();
    const layoutData = {
      id: layoutRef.id,
      name,
      requiredDocs, // e.g. [{ title: "Aadhar", description: "Upload Aadhar card" }]
      createdAt: new Date().toISOString(),
      createdBy: req.user?.uid || 'system'
    };

    await layoutRef.set(layoutData);

    return res.status(201).json({
      success: true,
      message: 'Layout created successfully',
      data: layoutData
    });
  } catch (error) {
    console.error('Error creating layout:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const updateLayout = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, requiredDocs } = req.body;

    if (!name || !Array.isArray(requiredDocs)) {
      return res.status(400).json({ success: false, message: 'Name and requiredDocs array are required' });
    }

    const layoutRef = db.collection('document_layouts').doc(id);
    const docSnapshot = await layoutRef.get();

    if (!docSnapshot.exists) {
      return res.status(404).json({ success: false, message: 'Layout not found' });
    }

    await layoutRef.update({
      name,
      requiredDocs,
      updatedAt: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: 'Layout updated successfully'
    });
  } catch (error) {
    console.error('Error updating layout:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const deleteLayout = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    await db.collection('document_layouts').doc(id).delete();

    return res.status(200).json({
      success: true,
      message: 'Layout deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting layout:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
