import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const [tipo, token] = String(req.headers.authorization ?? '').split(' ');

        if (tipo === 'Bearer' && token) {
            try {
                req.user = await this.jwtService.verifyAsync(token);
            } catch {
                // token inválido ou expirado: segue como anônimo
            }
        }
        return true;
    }
}