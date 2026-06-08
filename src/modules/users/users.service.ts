import { Injectable } from '@nestjs/common';
import { StorageService } from '@/shared';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { UserRequest } from '@/modules/auth/types/auth.jwt.types';
@Injectable()
export class UsersService {
  constructor(
    private readonly storageService: StorageService,
    private readonly prismaService: PrismaService,
  ) {}

  async uploadAvatar(data: {
    user: UserRequest;
    file: Express.Multer.File;
  }): Promise<void> {
    const { user, file } = data;
    const { sub, avatarUrl } = user;

    if (avatarUrl) {
      const key = this.storageService.extractKeyFromStoredUrl(avatarUrl);
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
