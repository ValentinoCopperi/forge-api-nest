import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserCurrent } from '@/modules/auth/decorators/user.decorator';
import { UserRequest } from '@/modules/auth/types/auth.jwt.types';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

const AVATAR_MAX_SIZE_BYTES = 5 * 1024 * 1024;
const AVATAR_MIME_TYPES = /^image\/(jpeg|png|webp)$/;

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('upload')
  @ApiOperation({
    summary: 'Upload avatar',
    description: 'Uploads an avatar for the current user',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Avatar uploaded successfully',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new MaxFileSizeValidator({ maxSize: AVATAR_MAX_SIZE_BYTES }),
          new FileTypeValidator({ fileType: AVATAR_MIME_TYPES }),
        ],
      }),
    )
    file: Express.Multer.File,
    @UserCurrent() user: UserRequest,
  ): Promise<void> {
    return this.usersService.uploadAvatar({ user, file });
  }
}
