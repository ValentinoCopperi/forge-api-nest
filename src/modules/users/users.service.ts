import { Injectable } from '@nestjs/common';
import { StorageService } from '@/shared';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { UserRequest } from '@/modules/auth/types/auth.jwt.types';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UsersService {
  constructor(
    private readonly storageService: StorageService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async uploadAvatar(data: {
    user: UserRequest;
    file: Express.Multer.File;
  }): Promise<void> {
    const { user, file } = data;
    const { sub, avatarUrl } = user;

    if (avatarUrl) {
      const key = avatarUrl.split(
        `${this.configService.getOrThrow<string>('S3_BUCKET')}/`,
      )[1];
      await this.storageService.deleteFile(key);
    }

    const key = this.storageService.createKey(file.originalname, sub);
    const url = await this.storageService.uploadFile(file, key);

    await this.prismaService.user.update({
      where: { id: sub },
      data: { avatarUrl: url },
    });
  }
}
