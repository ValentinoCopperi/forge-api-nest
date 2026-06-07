import { ApiProperty } from '@nestjs/swagger';

export class OrganizationUserResponseDto {
    @ApiProperty({
        description: 'The id of the user',
        example: 1,
        type: Number,
    })
    id: number;

    @ApiProperty({
        description: 'The name of the user',
        example: 'John Doe',
        type: String,
    })
    name: string;

    @ApiProperty({
        description: 'The email of the user',
        example: 'john.doe@example.com',
        type: String,
    })
    email: string;

    @ApiProperty({
        description: 'The avatar url of the user',
        example: 'https://example.com/avatar.png',
        type: String,
        nullable: true,
    })
    avatarUrl: string | null;
}
