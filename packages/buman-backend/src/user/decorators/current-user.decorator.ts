import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SafeUserDto } from '../dto/safe-user.dto';

export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext): SafeUserDto => {
        const req = context.switchToHttp().getRequest();
        return req.user;
    },
);
