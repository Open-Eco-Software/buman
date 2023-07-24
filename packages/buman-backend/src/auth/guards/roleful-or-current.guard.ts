// roleful-or-current-user.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Role, User } from '@prisma/client/buman';

/** RolefulOrCurrentUserGuard
 * A guard that authorizes access based on user roles or the user's own data.
 * It allows access if the user has one of the allowed roles or if the user is accessing their own information.
 * This guard ensures that only users with specific roles or the user themselves can access protected resources.
 */

// Defensive programming
// Admin
//
// GET /users/:id

interface UserRequest extends Request {
  user: User;
  params: { user: string };
}

@Injectable()
export class RolefulOrCurrentUserGuard implements CanActivate {
  constructor(private readonly allowedRoles: Role[]) { }

  private isCurrentUser(req: UserRequest) {
    return req.user?.id === req.params?.user;
  }

  private hasAllowedRole(req: UserRequest): boolean {
    return this.allowedRoles?.includes(req.user.role);
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    ///SIAMAND  NOTE: Demeter principle
    // SIAMAND  NOTE: Surreptitious dependency
    // SIAMAND  NOTE:: What if there was no allowedRoles?

    if (!(this.hasAllowedRole(request) || this.isCurrentUser(request))) {
      throw new UnauthorizedException('Unauthorized data access request');
    }

    return true;
  }
}
