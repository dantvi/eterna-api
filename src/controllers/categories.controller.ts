import { Request, Response } from 'express';
import { db } from '../config/firestore';

export const getAll = async (_: Request, res: Response): Promise<void> => {
  try {
    const snapshot = await db
      .collection('categories')
      .orderBy('sortOrder')
      .get();
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(categories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};
