import { PrismaClient, Bookmark } from '@prisma/client';

const prisma = new PrismaClient();

export async function getUserBookmarkedPosts(userId: string, page: number, limit: number = 9) {
  const skip = Math.max(0, (page - 1) * limit);
  const take = Math.min(limit, 10);

  const [bookmarks, totalCount] = await Promise.all([
    prisma.bookmark.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          skip,
          take,
          select: {
              id: true,
              createdAt: true,
              post: {
                  select: {
                      id: true,
                      caption: true,
                      images: { select: { url: true }, take: 1 },
                      user: {
                          select: {
                              id: true,
                              firstname: true,
                              lastname: true,
                              username: true,
                              avatar: true,
                          },
                      },
                  },
              },
          },
      }),
    prisma.bookmark.count({ where: { userId } }),
  ]);
  const items = bookmarks.map((b) => ({
    bookmarkId: b.id,
    createdAt: b.createdAt.toISOString(),
    post: {
      id: b.post.id,
      caption: b.post.caption ?? null,
      excerpt: b.post.caption ? b.post.caption.slice(0, 100) : null,
      thumbnail: b.post.images[0]?.url ?? null,
      author: {
        id: b.post.user.id,
        name:
          b.post.user.firstname && b.post.user.lastname
            ? `${b.post.user.firstname} ${b.post.user.lastname}`
            : b.post.user.username,
        avatar: b.post.user.avatar ?? null,
      },
    },
  }));

  return { items, total_records: totalCount, total_pages: Math.ceil(totalCount / limit), page, limit };
}