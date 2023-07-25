import { User } from '@prisma/client';

export type SafeUserDto = Omit<
    User,
    'password' | 'updatedAt' | 'fcmToken' | 'blocked' | 'resource'
>;
