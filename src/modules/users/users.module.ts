import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { StorageModule } from '@/shared';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [StorageModule],
})
export class UsersModule {}
