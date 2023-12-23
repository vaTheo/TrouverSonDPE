import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { TokenService } from './token.service';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const JWT = request.cookies['authorization']?.split(' ')[1]; // Bearer TOKEN
    console.log('JWT = ' + JWT);
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

    if (!requiredRoles) return true;
    if (!JWT) throw new UnauthorizedException('No token provided');

    try {
      request.user = this.tokenService.verifyJWT(JWT);
      console.log();
      // Retrieve the required roles for the route
      // Tu l'as déjà retrouvé au dessus non ?
      // const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
      if (!requiredRoles) {
        console.log('PASS you have the good role ');
        return true; // If no specific roles are required, allow access
      }

      // Check if the user's role matches any of the required roles
      const hasRole = requiredRoles.some((role) => request.user.role === role);
      if (!hasRole) {
        throw new UnauthorizedException('You do not have permission to access this resource');
      }

      return true;
    } catch (error) {
      console.log('c a mar hce pas ici ?'); // Tu régales mdr
      console.error(error); // => Pour les erreurs utilises console.error tu peux les retrouver plus facielement etc. pour tes deploiement
      throw new UnauthorizedException('Invalid token in RolesGuard');
    }
  }
}
