import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function AtLeastOneField(
  fields: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'atLeastOneField',
      target: object.constructor,
      propertyName,
      constraints: [fields],
      options: validationOptions,
      validator: {
        validate(_: unknown, args: ValidationArguments) {
          const allowedFields = args.constraints[0] as string[];
          const payload = args.object as Record<string, unknown>;

          return allowedFields.some((field) => payload[field] !== undefined);
        },
        defaultMessage(args: ValidationArguments) {
          const allowedFields = args.constraints[0] as string[];

          return `At least one of the following fields must be provided: ${allowedFields.join(', ')}`;
        },
      },
    });
  };
}
