import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Wrapper para parsear las respuestas de los endpoints que retornan arrays.
 *
 * @example
 * export const OrganizationOfUserResponseDto = createArrayResponseDto(
 *   OrganizationOfUserDto,
 *   'OrganizationOfUserResponseDto',
 * );
 */
export function createArrayResponseDto<TModel extends Type<unknown>>(
  model: TModel,
  name?: string,
) {
  class ArrayResponseDto {
    @ApiProperty({ type: model, isArray: true })
    data: InstanceType<TModel>[];

    @ApiProperty({ type: String, format: 'date-time' })
    timestamp: Date;
  }

  Object.defineProperty(ArrayResponseDto, 'name', {
    value: name ?? `${model.name}ListResponseDto`,
  });

  return ArrayResponseDto;
}
