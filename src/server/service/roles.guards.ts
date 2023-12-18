import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // Bearer TOKEN
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

    if (!requiredRoles) return true;
    if (!token) throw new UnauthorizedException('No token provided');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
      request.user = decoded;

      // Retrieve the required roles for the route
      const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
      if (!requiredRoles) {
        return true; // If no specific roles are required, allow access
      }

      // Check if the user's role matches any of the required roles
      const hasRole = requiredRoles.some((role) => request.user.role === role);
      if (!hasRole) {
        throw new UnauthorizedException('You do not have permission to access this resource');
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
