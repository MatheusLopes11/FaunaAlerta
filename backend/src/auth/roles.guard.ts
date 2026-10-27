import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!roles || roles.length === 0) return true;

        const { user } = context.switchToHttp().getRequest();
        if (!user || !roles.includes(user.perfil)) {
            throw new ForbiddenException('Você não tem permissão para esta ação.');
        }
        return true;
    }
}