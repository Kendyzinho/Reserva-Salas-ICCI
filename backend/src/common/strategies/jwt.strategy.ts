// Backend/src/common/strategies/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsuarioService } from 'src/modules/usuario/usuario.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private usuarioService: UsuarioService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // payload = { sub: id_usuario, correo, rol }
    const user = await this.usuarioService.findOne(payload.sub);

    if (!user) {
      throw new UnauthorizedException(
        'Token inválido o usuario no encontrado.',
      );
    }

    // El objeto retornado se adjunta a req.user
    return user;
  }
}
