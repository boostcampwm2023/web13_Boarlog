import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from './auth.service';
import { UserInfoDto } from './dto/userInfo.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile']
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    const { displayName, emails, photos } = profile;

    const user = UserInfoDto.of({
      username: displayName,
      email: emails[0].value,
      profile: photos[0].value
    });

    if ((await this.authService.findUser(user.email)) === null) {
      await this.authService.signUp(user);
    }

    const jwt = await this.authService.generateJWT(user);
    return { jwt };
  }
}
