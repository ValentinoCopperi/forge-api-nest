import {
  BadRequestException,
  Injectable,
  PipeTransform,
  ArgumentMetadata,
} from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: this.formatErrors(result.error),
      });
    }

    return result.data;
  }

  private formatErrors(error: ZodError) {
    return error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
  }
}
