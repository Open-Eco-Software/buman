import { Role, User } from '@prisma/client';
import { GetResult } from '@prisma/client/runtime';

export const mockUser: GetResult<User, { [x: string]: () => unknown }, never> =
{
    id: 1,
    username: 'mockUsername',
    displayName: 'mockDisplayName',
    email: 'mockEmail',
    password: 'mockPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
    fcmToken: 'mockFcmToken',
    verified: true,
    blocked: false,
    resource: 'mockResource',
    role: Role.CLIENT,
    // Add other missing properties...
};
