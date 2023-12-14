import { ApiProperty } from '@nestjs/swagger';

export class PresenterInfo {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  constructor(username: string, email: string) {
    this.username = username;
    this.email = email;
  }

  toJSON = () => {
    return { username: this.username, email: this.email };
  };
}
