export class UserInfoDto {
  username: string;
  email: string;
  profile: string;

  static of(user: any): UserInfoDto {
    return {
      username: user.username,
      email: user.email,
      profile: user.profile
    };
  }
}
