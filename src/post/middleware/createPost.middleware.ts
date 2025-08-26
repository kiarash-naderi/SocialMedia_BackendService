import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../auth/middleware/auth';
import { CreatePostResponse } from '../../types/createPost.types';
import { validateCreatePost } from '../validators/createPost.validator';



export function validateCreatePostMiddleware(req: AuthRequest, res: Response<CreatePostResponse>, next: NextFunction) {
  const { caption } = req.body;
  const images = req.files as Express.Multer.File[] | undefined;

  const error = validateCreatePost({ caption, images });
  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  next();
}

