import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signin() {
    return {
      msg: 'Eingeloggt',
    };
  }

  signup() {
    return {
      msg: 'Angemeldet',
    };
  }
}
