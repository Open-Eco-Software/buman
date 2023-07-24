import {
  Injectable,
  BadRequestException,
  Logger,
  Inject,
} from '@nestjs/common';
import { PasswordService } from '../../auth/services/password.service';
import { ChangePasswordInput } from '../dto/change-password.input';
import { UpdateUserDto } from '../dto/update-user.input';
import {
  PrismaClient as BumanPrismaClient,
  User,
  Role,
} from '@prisma/client/buman';
import { CreateUserDto } from '../dto/create-user.dto';
import { CustomPrismaService } from 'nestjs-prisma';

@Injectable()
export class UserService {
  private logger = new Logger('UsersService');
  constructor(
    @Inject('BumanPrismaClient')
    private prisma: CustomPrismaService<BumanPrismaClient>,
    private passwordService: PasswordService
  ) { }

  findAll() {
    return this.prisma.client.user.findMany();
  }

  async findOne(query: {
    id?: string;
    email?: string;
    username?: string;
  }): Promise<User | null> {
    const { id, email, username } = query;
    if (!id && !email && !username) {
      throw new Error(
        'At least one of id, email, or username must be provided.'
      );
    }

    const user: User | null = await this.prisma.client.user.findFirst({
      where: {
        id,
        email,
        username,
      },
    });

    return user || null;
  }

  public create(data: CreateUserDto) {
    this.logger.log(`Create ${data}`);
    return this.prisma.client.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: Role.CLIENT,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  public delete(id: string) {
    this.prisma.client.user.delete({
      where: { id },
    });
  }

  public update(id: string, newUserData: UpdateUserDto) {
    return this.prisma.client.user.update({
      data: newUserData,
      where: {
        id,
      },
    });
  }

  public block(id: string, state: boolean) {
    return this.prisma.client.user.update({
      where: {
        id,
      },
      data: {
        blocked: state,
      },
    });
  }

  async changePassword(
    userId: string,
    userPassword: string,
    changePassword: ChangePasswordInput
  ) {
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword
    );

    return this.prisma.client.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: userId },
    });
  }

  // TODO: Verify the user as official exchanger within the system
  // async verify(id: string, data: VerifyUser) { }

  async updateUserRole(id: string, role: Role): Promise<User> {
    return this.prisma.client.user.update({
      where: { id },
      data: { role },
    });
  }
}
