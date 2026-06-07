import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      endpoint: this.configService.getOrThrow<string>('S3_ENDPOINT'),
      region: this.configService.getOrThrow<string>('S3_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow<string>('S3_SECRET_KEY'),
      },
      forcePathStyle: true,
    });
  }

  public createKey(fileName: string, id: number): string {
    const ext = fileName.split('.').pop();
    return `avatars/user-${String(id)}/${ext}`;
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.configService.getOrThrow<string>('S3_BUCKET'),
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });
      await this.s3.send(command);
      return `${this.configService.getOrThrow<string>('S3_ENDPOINT')}/${this.configService.getOrThrow<string>('S3_BUCKET')}/${key}`;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Error uploading file');
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.configService.getOrThrow<string>('S3_BUCKET'),
        Key: key,
      });
      await this.s3.send(command);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Error deleting file');
    }
  }
}
