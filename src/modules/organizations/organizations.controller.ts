import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { Role } from 'generated/prisma/enums';
import { Roles, UserCurrent } from '@/modules/auth/decorators';
import { RolesGuard } from '@/modules/auth/guards';
import {
  AddUserToOrganizationDto,
  CreateOrganizationDto,
  OrganizationCreateResponseDto,
  OrganizationFindOneResponseDto,
  OrganizationOfUserResponseDto,
  OrganizationsGetAllListResponseDto,
  RemoveUserFromOrganizationDto,
  UpdateOrganizationDto,
  UpdateUserOrganizationRoleDto,
} from '@/modules/organizations/dto';
import { OrganizationsService } from './organizations.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { UserRequest } from '@/modules/auth/types';
import {
  OrganizationCreateResponse,
  OrganizationFindOneResponse,
  OrganizationsGetAll,
  OrganizationsGetAllByUserId,
} from '@/modules/organizations/types';
import { OrganizationActionGuard } from './guards/organization.action.guard';
import { RequireOrgAction } from './decorators/action.decorator';
import { ApiCommonErrors } from '@/shared/decorators';
import { ApiTags } from '@nestjs/swagger';
import { AVATAR_MAX_SIZE_BYTES, AVATAR_MIME_TYPES } from '@/shared/constants';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';


@ApiTags('Organizations')
@ApiCommonErrors()
@UseGuards(RolesGuard, OrganizationActionGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) { }

  @Post()
  @Roles([Role.DIRECTOR])
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiBody({ type: CreateOrganizationDto })
  @ApiCreatedResponse({ type: OrganizationCreateResponseDto })
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @UserCurrent() user: UserRequest,
  ): Promise<OrganizationCreateResponse> {
    return this.organizationsService.create({ createOrganizationDto, user });
  }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiOkResponse({ type: OrganizationsGetAllListResponseDto })
  findAll(): Promise<OrganizationsGetAll[]> {
    return this.organizationsService.findAll();
  }

  @Post('add-user')
  @RequireOrgAction('add-user')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Add a user to an organization' })
  @ApiBody({ type: AddUserToOrganizationDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  addUserToOrganization(
    @Body() addUserToOrganizationDto: AddUserToOrganizationDto,
  ): Promise<void> {
    return this.organizationsService.addUserToOrganization(
      addUserToOrganizationDto,
    );
  }

  @Delete('remove-user')
  @RequireOrgAction('remove-user')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Remove a user from an organization' })
  @ApiBody({ type: RemoveUserFromOrganizationDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  removeUserFromOrganization(
    @Body() removeUserFromOrganizationDto: RemoveUserFromOrganizationDto,
  ): Promise<void> {
    return this.organizationsService.removeUserFromOrganization(
      removeUserFromOrganizationDto,
    );
  }

  @Patch('update-user-role')
  @RequireOrgAction('update-user-role')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update a user role in an organization' })
  @ApiBody({ type: UpdateUserOrganizationRoleDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  updateUserOrganizationRole(
    @Body() updateUserOrganizationRoleDto: UpdateUserOrganizationRoleDto,
  ): Promise<void> {
    return this.organizationsService.updateUserOrganizationRole(
      updateUserOrganizationRoleDto,
    );
  }

  @Get('user')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all organizations of the current user' })
  @ApiOkResponse({ type: OrganizationOfUserResponseDto })
  findAllByUserId(
    @UserCurrent() user: UserRequest,
  ): Promise<OrganizationsGetAllByUserId[]> {
    return this.organizationsService.findAllByUserId(user.sub);
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get an organization by id' })
  @ApiOkResponse({ type: OrganizationFindOneResponseDto })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The id of the organization',
    example: 1,
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrganizationFindOneResponse> {
    return this.organizationsService.findOne(id);
  }

  @Patch(':id')
  @RequireOrgAction('update')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logoFile', maxCount: 1 },
      { name: 'bannerFile', maxCount: 1 },
    ]),
  )
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update an organization' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The id of the organization',
    example: 1,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'My Organization' },
        description: { type: 'string', example: 'Description' },
        logoFile: { type: 'string', format: 'binary' },
        bannerFile: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOkResponse({ type: OrganizationCreateResponseDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
    @UserCurrent() user: UserRequest,
    @UploadedFiles()
    files: {
      logoFile?: Express.Multer.File[];
      bannerFile?: Express.Multer.File[];
    },
  ): Promise<OrganizationCreateResponse> {
    return this.organizationsService.update({
      id,
      updateOrganizationDto,
      user,
      logoFile: files?.logoFile?.[0],
      bannerFile: files?.bannerFile?.[0],
    });
  }

  @Delete(':id')
  @RequireOrgAction('delete')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete an organization' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The id of the organization',
    example: 1,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.organizationsService.remove(id);
  }
}
