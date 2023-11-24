interface UserInfo {
  username: string;
  email: string;
  profile: string;
}

export class UserInfoDto {
  username: string;
  email: string;
  profile: string;

  constructor({ username, email, profile }) {
    this.username = username;
    this.email = email;
    this.profile = profile;
  }

  static of(user: UserInfo): UserInfo {
    return {
      username: user.username,
      email: user.email,
      profile: user.profile
    };
  }
}
