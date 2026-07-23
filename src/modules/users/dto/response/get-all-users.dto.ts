import { UserGetAll } from "@/modules/users/types";
import { ApiProperty } from "@nestjs/swagger";
import { $Enums } from "generated/prisma/client";



export class GetAllUsersResponseDto implements UserGetAll {



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

    @ApiProperty({
        description: 'The roles of the user',
        example: ['DIRECTOR', 'GERENTE', 'EMPLEADO'],
        enum: $Enums.Role,
    })
    UserRole: {
        role: $Enums.Role;
    }[];

    
}