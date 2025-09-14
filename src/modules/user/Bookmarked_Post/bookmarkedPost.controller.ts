import { Response } from 'express';
import { AuthRequest } from '../../auth/auth.middleware';
import { handleError } from '../../../utils/errorHandler';
import { getUserBookmarkedPosts } from './bookmarkedPost.service';
import { BookmarkedPostsResponseDto } from './bookmarkedPost.types';

export async function getUserBookmarkedPostsHandler(req: AuthRequest, res: Response<BookmarkedPostsResponseDto>) {
  try {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;

    const { items, total_records, total_pages, page: currentPage, limit: currentLimit } = await getUserBookmarkedPosts(userId, page, limit);

    return res.json({
      success: true,
      message: items.length ? 'بوکمارک‌ها دریافت شدند' : 'هیچ بوکمارکی یافت نشد',
      data: {
        items,
        pagination: {
          page: currentPage,
          limit: currentLimit,
          total_records,
          total_pages,
        },
      },
    });
  } catch (error) {
    return handleError(error, res, 'خطا در دریافت لیست بوکمارک‌ها');
  }
}