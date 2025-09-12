// post.middleware.ts
import { NextFunction, Response } from 'express';
import { validateAll } from './post.validator';
import { AuthRequest } from '../auth/auth.middleware';
import { validateGetUserPosts } from '../../utils/validators';

export async function validateAllMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const { caption, mentions }: { caption?: string; mentions?: string | string[] } = req.body; // تایپ‌دهی صریح
  const images = (req.files as Express.Multer.File[] | undefined) ?? undefined;

  let cleanedMentions: string[] = [];
  if (mentions) {
    if (typeof mentions === 'string') {
      try {
        const parsedMentions = JSON.parse(mentions);
        cleanedMentions = Array.isArray(parsedMentions) ? parsedMentions : [parsedMentions];
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'خطا در پارسینگ منشن‌ها',
          data: { mentions: 'فرمت منشن‌ها باید آرایه JSON معتبر باشد' },
        });
      }
    } else if (Array.isArray(mentions)) {
      cleanedMentions = mentions;
    }
    cleanedMentions = cleanedMentions.map(m => m.replace('@', '')); 
  }

  const errors = await validateAll({ caption, images, mentions: cleanedMentions });
  if (errors.images || errors.caption || errors.mentions || errors.hashtags) {
    return res.status(400).json({ success: false, message: 'خطا در اعتبارسنجی', data: errors });
  }
  req.body.mentions = cleanedMentions; 
  next();
}

export async function validateGetUserPostsMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const { username } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const errors = await validateGetUserPosts({ username, page, limit });
  if (errors.username || errors.page || errors.limit) {
    return res.status(400).json({ success: false, message: 'خطا در اعتبارسنجی', data: errors });
  }
  next();
}