
export function validateCreatePost(data: { caption?: string; images?: Express.Multer.File[] }): string | null {
  if (data.caption && data.caption.length > 500) {
    return 'توضیحات حداکثر ۵۰۰ کاراکتر می‌تواند باشد';
  }
  if (data.images) {
    if (data.images.length > 5) {
      return 'حداکثر ۵ عکس مجاز است';
    }
    for (const image of data.images) {
      if (!['image/jpeg', 'image/png'].includes(image.mimetype)) {
        return 'فقط فرمت‌های JPG و PNG مجاز هستند';
      }
      if (image.size > 5 * 1024 * 1024) {
        return 'هر عکس حداکثر ۵ مگابایت می‌تواند باشد';
      }
    }
  } else {
    return 'حداقل یک عکس لازم است';
  }
  return null;
}