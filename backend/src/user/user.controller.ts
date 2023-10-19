import { CACHE_MANAGER, CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { AuthService } from './services/auth/auth.service';
import { UserService } from './services/user/user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @Post('register')
  async register(@Body() user: CreateUserDto) {
    const newUser = await this.authService.register(user);
    this.cacheManager.del('getUsers')
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
  // @AllowedRoles(Role.SuperAdmin)
  // @UseInterceptors(CacheInterceptor)
  // @CacheKey('getUsers')
  @Get()
  async getUsers() {
    const users = await this.userService.getAll();
    return {
      message: 'Users retrieved successfully',
      users,
    };
  }
}
