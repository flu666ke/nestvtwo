import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { IUser } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    private jwtService: JwtService,
  ) {}
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const saltPassword = await this.hashPassword(password, salt);

    const user = new this.userModel({
      username,
      salt,
      password: saltPassword,
    });

    try {
      await user.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.validateUserPassword(authCredentialsDto);

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    try {
      const user = await this.userModel.findOne({ username });
      const hashPassword = user.password;
      const userSalt = user.salt;

      if (
        user &&
        (await this.validatePassword(password, hashPassword, userSalt))
      ) {
        return user.username;
      } else {
        return null;
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async validatePassword(
    password: string,
    hashPassword: string,
    userSalt: string,
  ): Promise<boolean> {
    const hash = await bcrypt.hash(password, userSalt);
    return hash === hashPassword;
  }

  private hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
