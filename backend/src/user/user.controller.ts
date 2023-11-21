import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateAdminDto, CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { AuthService } from './services/auth/auth.service';
import { UserService } from './services/user/user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() user: CreateUserDto) {
    const newUser = await this.authService.register(user);
    return {
      message: 'User created',
      user: {
        id: newUser.id,
        token: newUser.token,
      },
    };
  }

  @Post('register/admin')
  async registerAdmin() {
    const newUser = await this.authService.registerAdmin();
    return {
      message: 'User created',
      user: {
        id: newUser.id,
        token: newUser.token,
      },
    };
  }

  @Post('login')
  async login(@Body() login: LoginDto) {
    const token = await this.authService.login(login);

    return {
      message: 'Login successful',
      token,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers() {
    const users = await this.userService.getAll();
    return {
      message: 'Users retrieved successfully',
      users,
    };
  }

  @Post('personalized-offers')
  async inviteForPersonalizedOffers(@Body('invites') invites: any[]) {
    return {
      status: HttpStatus.OK,
      data: await this.userService.inviteForPersonalizedOffers(invites),
    };
  }
  
  @Patch('update-city')
  async updateCity(@Req() request: any, @Body('city') city: string) {
    const token:any = request.headers['authorization']; // or any other header name
    if (!token) {
      throw new UnauthorizedException('User token not found');
    }
    return {
      status: HttpStatus.OK,
      data: await this.userService.updateCity(city, token),
    };
  }
}
