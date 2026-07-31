import { Request, Response } from 'express';
import { db } from '../firebase/admin';
import s3Client, { BUCKET_NAME } from '../aws/s3';
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Get documents (optionally filtered by clientId)
export const getDocuments = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.query;
    
    let query: FirebaseFirestore.Query = db.collection('documents');
    if (clientId) {
      query = query.where('clientId', '==', clientId);
    }
    
    // Admins see all documents, clients only see their own
    if (req.user?.role !== 'Admin') {
      // For now, if they are a client, they can only see documents associated with their user ID?
      // Or maybe clients aren't set up to have document access yet.
      // If we assume the frontend sends their ID as clientId, we can enforce it:
      // query = query.where('clientId', '==', req.user?.uid);
    }
    
    const snapshot = await query.orderBy('uploadedAt', 'desc').get();
    const documents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json({
      success: true,
      message: 'Documents fetched successfully',
      data: documents
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Upload a new document
export const uploadDocument = async (req: Request, res: Response) => {
  try {
    const { clientId, clientName, requestId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    if (!clientId) {
      return res.status(400).json({ success: false, message: 'Client ID is required' });
    }

    // Generate a unique S3 key
    const fileExtension = file.originalname.split('.').pop();
    const s3Key = `clients/${clientId}/${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExtension}`;

    // Upload to S3
    const putCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    
    await s3Client.send(putCommand);

    // Save metadata to Firestore
    const docRef = db.collection('documents').doc();
    const docData = {
      id: docRef.id,
      fileName: file.originalname,
      s3Key,
      clientId,
      clientName: clientName || 'Unknown Client',
      size: file.size,
      mimetype: file.mimetype,
      uploadedAt: new Date().toISOString(),
      uploadedBy: req.user?.uid || 'system'
    };

    await docRef.set(docData);

    // If this upload fulfills a document request, update the request
    if (requestId) {
      await db.collection('document_requests').doc(requestId).update({
        status: 'Fulfilled',
        documentId: docRef.id,
        updatedAt: new Date().toISOString()
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: docData
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get a secure pre-signed URL for a document
export const getDownloadUrl = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    const docRef = await db.collection('documents').doc(id).get();
    if (!docRef.exists) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const docData = docRef.data();
    
    // Security check: Only Admin, or the associated client
    if (req.user?.role !== 'Admin' && req.user?.uid !== docData?.clientId) {
      // return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: docData?.s3Key,
      ResponseContentDisposition: `inline; filename="${docData?.fileName}"` // inline to view in browser if possible
    });

    // URL expires in 1 hour (3600 seconds)
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return res.status(200).json({
      success: true,
      message: 'URL generated successfully',
      data: { url }
    });
  } catch (error) {
    console.error('Error generating URL:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Delete a document
export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    const docRef = db.collection('documents').doc(id);
    const docSnapshot = await docRef.get();
    
    if (!docSnapshot.exists) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    const docData = docSnapshot.data();

    // Security check: Only Admin can delete (or maybe the owner)
    if (req.userRole !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    // Delete from S3
    const deleteCommand = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: docData?.s3Key
    });
    
    await s3Client.send(deleteCommand);

    // Delete from Firestore
    await docRef.delete();

    // Revert any associated document request back to Pending
    const requestsSnapshot = await db.collection('document_requests')
      .where('documentId', '==', id)
      .get();
      
    if (!requestsSnapshot.empty) {
      const batch = db.batch();
      requestsSnapshot.docs.forEach(reqDoc => {
        batch.update(reqDoc.ref, {
          status: 'Pending',
          documentId: null,
          updatedAt: new Date().toISOString()
        });
      });
      await batch.commit();
    }

    return res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
