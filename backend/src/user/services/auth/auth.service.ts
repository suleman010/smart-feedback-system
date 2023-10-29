import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from '../../dto/login.dto';
import { UserEntity } from '../../entities/user.entity';
import { Role } from 'src/user/guards/role.enum';
import { CreateAdminDto, CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(userDto: CreateUserDto): Promise<UserEntity> {
    // check if user exists and send custom error message
    if (await this.userService.isUserExists(userDto.email)) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    return await this.userService.createUser(userDto);
  }
  
  async registerAdmin(): Promise<UserEntity> {
    // check if user exists and send custom error message
    // if (await this.userService.isUserExists(userDto.email)) {
    //   throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    // }
    let userDto: CreateAdminDto = {
      role : Role.SuperAdmin,
      firstName : 'Super',
      lastName : 'Admin',
      phone : '+112345678', 
      password : 'admin',
      email : 'admin@admin.com',
    }

    return await this.userService.createUser(userDto);
  }

  async login(loginRequest: LoginDto): Promise<any | void> {
    const { email, password } = loginRequest;
    const user = await this.userService.isUserExists(email);

    if (!user) {
      return this.failLogin();
    }

    if (await this.userService.checkUserPassword(user, password)) {
      const token = this.userService.getUserToken(user);
      user.token = token;
      await this.userService.updateUser(user);
      return { token: token, company: user.company, adminId: user.id, role: user.role };
    }

    this.failLogin('Incorrect password');
  }

  private failLogin(message = 'Login failed') {
    throw new HttpException(message, HttpStatus.BAD_REQUEST);
  }
}
