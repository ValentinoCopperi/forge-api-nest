import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const DEFAULT_PRESIGN_EXPIRES_IN_SECONDS = 3600;

const STORAGE_URL_FIELDS = new Set(['avatarUrl', 'logoUrl', 'bannerUrl']);

@Injectable()
export class StorageService {
  private readonly s3: S3Client;

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

  extractKeyFromStoredUrl(storedUrl: string): string {
    if (storedUrl.startsWith('avatars/')) {
      return storedUrl;
    }

    const bucket = this.configService.getOrThrow<string>('S3_BUCKET');
    const marker = `/${bucket}/`;
    const markerIndex = storedUrl.indexOf(marker);

    if (markerIndex === -1) {
      throw new Error(`Invalid stored avatar URL: ${storedUrl}`);
    }

    return storedUrl.slice(markerIndex + marker.length);
  }

  createOrganizationAssetKey(
    organizationId: number,
    asset: 'logo' | 'banner',
    fileName: string,
  ): string {
    const ext = fileName.split('.').pop()?.toLowerCase() ?? 'bin';
    return `organizations/${organizationId}/${asset}.${ext}`;
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

  async getPresignedUrl(
    key: string,
    expiresIn = this.configService.get<number>(
      'S3_PRESIGN_EXPIRES_IN',
      DEFAULT_PRESIGN_EXPIRES_IN_SECONDS,
    ),
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.configService.getOrThrow<string>('S3_BUCKET'),
      Key: key,
    });

    return getSignedUrl(this.s3, command, { expiresIn });
  }

  async resolveAvatarUrl(storedUrl: string | null): Promise<string | null> {
    if (!storedUrl) {
      return null;
    }

    const key = this.extractKeyFromStoredUrl(storedUrl);
    return this.getPresignedUrl(key);
  }

  async signAvatarUrls<T>(value: T): Promise<T> {
    if (value === null || value === undefined) {
      return value;
    }

    if (Array.isArray(value)) {
      return Promise.all(
        value.map((item) => this.signAvatarUrls(item)),
      ) as Promise<T>;
    }

    if (typeof value === 'object') {
      const record = value as Record<string, unknown>;
      const entries = await Promise.all(
        Object.entries(record).map(async ([key, entryValue]) => {
          if (
            STORAGE_URL_FIELDS.has(key) &&
            (typeof entryValue === 'string' || entryValue === null)
          ) {
            return [key, await this.resolveAvatarUrl(entryValue)];
          }

          return [key, await this.signAvatarUrls(entryValue)];
        }),
      );

      return Object.fromEntries(entries) as T;
    }

    return value;
  }
}
