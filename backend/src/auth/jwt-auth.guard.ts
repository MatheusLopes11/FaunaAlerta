import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const [tipo, token] = String(req.headers.authorization ?? '').split(' ');

        if (tipo !== 'Bearer' || !token) {
            throw new UnauthorizedException('Faça login para continuar.');
        }
        try {
            req.user = await this.jwtService.verifyAsync(token);
        } catch {
            throw new UnauthorizedException('Sessão inválida ou expirada.');
        }
        return true;
    }
}