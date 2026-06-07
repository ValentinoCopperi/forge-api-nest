import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

type UserIdentifierDto = {
    userId?: number;
    email?: string;
};

@ValidatorConstraint({ name: 'ExactlyOneUserIdentifier', async: false })
class ExactlyOneUserIdentifierConstraint implements ValidatorConstraintInterface {
    validate(_: unknown, validationArguments?: ValidationArguments) {
        const { userId, email } = validationArguments?.object as UserIdentifierDto;
        const hasUserId = userId != null;
        const hasEmail = email != null && email !== '';

        return hasUserId !== hasEmail;
    }

    defaultMessage() {
        return 'Provide either userId or email, but not both';
    }
}

export function ExactlyOneUserIdentifier(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'exactlyOneUserIdentifier',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: ExactlyOneUserIdentifierConstraint,
        });
    };
}
