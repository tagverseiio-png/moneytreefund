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
    
    if (req.userRole !== 'Admin') {
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
    if (req.userRole !== 'Admin' && req.user?.uid !== id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const snapshot = await db.collection('document_requests')
      .where('clientId', '==', id)
      .get();
      
    let requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    requests = requests.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const createDocumentRequest = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, description, type } = req.body;

    if (req.userRole !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const reqRef = db.collection('document_requests').doc();
    const reqData = {
      id: reqRef.id,
      clientId: id,
      title,
      description: description || '',
      type: type || 'file',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      createdBy: req.user?.uid || 'system'
    };

    await reqRef.set(reqData);

    return res.status(201).json({ success: true, message: 'Request created', data: reqData });
  } catch (error) {
    console.error('Error creating request:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const submitTextResponse = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const requestId = req.params.requestId as string;
    const { textResponse } = req.body;

    if (!textResponse) {
      return res.status(400).json({ success: false, message: 'Text response is required' });
    }

    // Client can only submit their own, Admin can submit for anyone (rare, but possible)
    if (req.userRole !== 'Admin' && req.user?.uid !== id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const reqRef = db.collection('document_requests').doc(requestId);
    const reqDoc = await reqRef.get();

    if (!reqDoc.exists || reqDoc.data()?.clientId !== id) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (reqDoc.data()?.type !== 'text') {
      return res.status(400).json({ success: false, message: 'This request requires a file upload, not text' });
    }

    await reqRef.update({
      textResponse,
      status: 'Fulfilled',
      fulfilledAt: new Date().toISOString()
    });

    return res.status(200).json({ success: true, message: 'Text response submitted successfully' });
  } catch (error) {
    console.error('Error submitting text response:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getPasswordResets = async (req: Request, res: Response) => {
  try {
    if (req.userRole !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const snapshot = await db.collection('password_reset_requests')
      .where('status', '==', 'Pending')
      .get();

    let requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    requests = requests.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error('Error fetching password resets:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { password } = req.body;

    if (req.userRole !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Update the password in Firebase Auth
    await auth.updateUser(id, { password });

    // Find and fulfill any pending reset requests for this user's email
    // First, we need the user's email to mark their requests as Fulfilled.
    const userRecord = await auth.getUser(id);
    if (userRecord.email) {
      const pendingResets = await db.collection('password_reset_requests')
        .where('email', '==', userRecord.email)
        .where('status', '==', 'Pending')
        .get();
        
      const batch = db.batch();
      pendingResets.docs.forEach(doc => {
        batch.update(doc.ref, { status: 'Fulfilled', fulfilledAt: new Date().toISOString() });
      });
      await batch.commit();
    }

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const updateClientLayout = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { layoutId } = req.body;

    if (req.userRole !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    if (!layoutId) {
      return res.status(400).json({ success: false, message: 'Layout ID is required' });
    }

    const batch = db.batch();
    batch.update(db.collection('clients').doc(id), { layoutId });
    batch.update(db.collection('users').doc(id), { layoutId });

    // Fetch the layout to get requiredDocs
    const layoutDoc = await db.collection('document_layouts').doc(layoutId).get();
    if (layoutDoc.exists) {
      const requiredDocs = layoutDoc.data()?.requiredDocs || [];
      
      // Fetch existing requests to prevent duplicate generation
      const existingReqsSnap = await db.collection('document_requests')
        .where('clientId', '==', id)
        .get();
      const existingTitles = new Set(existingReqsSnap.docs.map(doc => doc.data().title));

      for (const docReq of requiredDocs) {
        if (!existingTitles.has(docReq.title)) {
          const newReqRef = db.collection('document_requests').doc();
          batch.set(newReqRef, {
            id: newReqRef.id,
            clientId: id,
            title: docReq.title,
            description: docReq.description || '',
            type: docReq.type || 'file',
            status: 'Pending',
            createdAt: new Date().toISOString(),
            createdBy: req.userRole === 'Admin' ? (req.user?.uid || 'admin') : 'system'
          });
        }
      }
    }

    await batch.commit();

    return res.status(200).json({ success: true, message: 'Client layout updated successfully' });
  } catch (error) {
    console.error('Error updating client layout:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

