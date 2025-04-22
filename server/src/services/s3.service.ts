import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { IMulterFile } from '../types/types';

export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    });
    this.bucketName = process.env.AWS_BUCKET_NAME!;
  }

  async uploadImage(file: IMulterFile): Promise<string> {
    const key = `images/${uuidv4()}-${file.originalname}`;
    
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    });

    await this.s3Client.send(command);
    return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  async deleteImage(imageUrl: string): Promise<void> {
    const key = imageUrl.split('.com/')[1];
    
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key
    });

    await this.s3Client.send(command);
  }
} 