import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { IMulterFile } from '../types/types';
import { S3BucketErrors } from './constants';
import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env.development' });
}

// Validate required environment variables
const requiredEnvVars = ['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_BUCKET_NAME'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Configure AWS S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function uploadToS3Bucket(
  file: IMulterFile,
  folderName: string
): Promise<string> {
  try {
    if (!file) {
      throw new Error(S3BucketErrors.NO_FILE);
    }

    if (!file.buffer) {
      throw new Error('File buffer is required');
    }

    const key = `${folderName}/${Date.now()}_${file.originalname}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: 'public-read',
    });

    await s3Client.send(command);

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error: any) {
    console.error('S3 Upload Error:', error);
    throw new Error(error.message || S3BucketErrors.UPLOAD_ERROR);
  }
}

export async function deleteFromS3Bucket(imageUrl: string): Promise<void> {
  try {
    const key = imageUrl.split('.com/')[1];
    
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error: any) {
    console.error('S3 Delete Error:', error);
    throw new Error(error.message || S3BucketErrors.DELETE_ERROR);
  }
} 