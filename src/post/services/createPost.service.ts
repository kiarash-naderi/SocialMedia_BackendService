import { PrismaClient } from '@prisma/client';
   import { minioClient } from '../../config/minio.config';
   import path from 'path';

   const prisma = new PrismaClient();
   const BUCKET_NAME = 'rahnama'; // تغییر از 'posts' به 'rahnama'

   async function ensureBucketExists() {
     const exists = await minioClient.bucketExists(BUCKET_NAME);
     if (!exists) {
       await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
     }
   }

   export async function uploadImageToMinIO(file: Express.Multer.File, userId: string): Promise<string> {
     await ensureBucketExists();
     const objectName = `${userId}/${Date.now()}${path.extname(file.originalname)}`;
     await minioClient.putObject(BUCKET_NAME, objectName, file.buffer, file.size, { 'Content-Type': file.mimetype });
     const presignedUrl = await minioClient.presignedGetObject(BUCKET_NAME, objectName, 24 * 60 * 60); // لینک 24 ساعته
     return presignedUrl;
   }

   export async function createPost(
     userId: string,
     caption: string | undefined,
     images: Express.Multer.File[] | undefined
   ): Promise<{ id: string; caption: string | null; images: { url: string }[] }> {
     if (!images || images.length === 0) {
       throw new Error('حداقل یک عکس لازم است');
     }

     const imageUrls: string[] = [];
     for (const image of images) {
       const url = await uploadImageToMinIO(image, userId);
       imageUrls.push(url);
     }

     const post = await prisma.post.create({
       data: {
         userId,
         caption: caption || null,
         images: {
           create: imageUrls.map(url => ({ url })),
         },
       },
       select: {
         id: true,
         caption: true,
         images: {
           select: { url: true },
         },
       },
     });

     return post;
   }