import { Type, applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { createArrayResponseDto } from '@/shared/dto';

export function ApiArrayOkResponse<TModel extends Type<unknown>>(
  model: TModel,
  options?: { responseName?: string },
) {
  const responseDto = createArrayResponseDto(
    model,
    options?.responseName ?? `${model.name}ListResponseDto`,
  );

  return applyDecorators(ApiOkResponse({ type: responseDto }));
}
