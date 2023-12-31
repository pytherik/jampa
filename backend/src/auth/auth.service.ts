import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, LoginDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          hash,
        },
      });
      const token = await this.signToken(user.id, user.email);

      return { access_token: token };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email ist schon vergeben!');
        }
      }
      throw error;
    }
  }

  async signin(dto: LoginDto) {
    console.log({ dto });
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
        },
      });
      if (!user) throw new ForbiddenException('Zugangsdaten fehlerhaft!');
      const pwMatches = await argon.verify(user.hash, dto.password);
      if (!pwMatches) throw new ForbiddenException('Zugangsdaten fehlerhaft!');
      const token = await this.signToken(user.id, user.email);

      return { access_token: token };
    } catch (error) {
      throw error;
    }
  }

  signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    return this.jwt.signAsync(payload, {
      expiresIn: '3m',
      secret: secret,
    });
  }
}
