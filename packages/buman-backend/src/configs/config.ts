import type { Config } from './config.interface';

const config: Config = {
  backend: {
    port: 3000,
  },
  helmet: {
    enabled: true,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'API Server Documentation',
    description: 'API Description server',
    version: '1.0',
    path: 'swg',
    user: 'bumanThe@Admin',
    password: 'Buman#TheGreatGoat',
    env: ['local', 'staging', 'development'],
  },
  security: {
    expiresIn: '5m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
    passwordResetTokenExpiresIn: '5m',
  },
  admin: {
    username: 'admin',
    email: 'admin@buman123',
    password: '4DM1N#2M1N#2398@0!s0233l',
    id: 0,
  },
};

export default config;
