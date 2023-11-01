import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { JwtService } from '../jwt/jwt.service';
import { PasswordService } from '../password/password.service';
import { CreateAdminDto } from 'src/user/dto/create-user.dto';
import { Role } from 'src/user/guards/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) { }

  async isUserExists(email: string): Promise<UserEntity | null> {
    if (email) {
      return this.usersRepository.findOne({
        where: {
          email: email.toLowerCase(),
        },
      });
    } else {
      return null;
    }
  }

  async createUser(userDto: any): Promise<UserEntity> {
    let userPayload;
    if(userDto.role == Role.SuperAdmin){
      userPayload = {
        email: userDto.email ? userDto?.email.toLowerCase() : '',
        firstName: userDto.firstName,
        lastName: userDto.lastName,
        role: userDto.role,
        passwordHash: await this.passwordService.generate(userDto.password),
      };
    }else{
      userPayload = {
        email: userDto.email ? userDto?.email.toLowerCase() : '',
        firstName: userDto.firstName,
        lastName: userDto.lastName,
        role: Role.user,
        phone: userDto.phone,
        isVirtual: userDto.isVirtual || false, // Default to false if not provided
        manufacturer: userDto.manufacturer,
        model: userDto.model,
        operatingSystem: userDto.operatingSystem,
        osVersion: userDto.osVersion,
        platform: userDto.platform,
        webViewVersion: userDto.webViewVersion,
        invitation: userDto.invitation || false, // Default to false if not provided
        city: userDto.city,
      };
      
    }


    let newUser = await this.usersRepository.create(userPayload);
    newUser = await this.updateUser(newUser);

    newUser.token = this.getUserToken(newUser);
    return await this.updateUser(newUser);
  }

  async updateUser(newUser: UserEntity): Promise<UserEntity> {
    return await this.usersRepository.save(newUser);
  }

  async checkUserPassword(
    user: UserEntity,
    requestPassword: string,
  ): Promise<boolean> {
    return this.passwordService.compare(requestPassword, user.passwordHash);
  }

  public getUserToken(user: UserEntity): string {
    return this.jwtService.sign({
      id: user.id,
      email: user.email.toLowerCase(),
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    });
  }

  public async getAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find({
      select: ['id', 'email', 'lastName', 'firstName', 'role', 'created_at'],
    });
  }

  public async findOne(id: number): Promise<UserEntity | null> {
    return await this.usersRepository.findOne({
      select: ['id', 'email', 'lastName', 'firstName', 'role', 'created_at'], where: { id: id }
    });
  }

  async delete(id:number){
    await this.usersRepository.delete(id)
  }

  async inviteForPersonalizedOffers(invites: any[]) {
    for (let i = 0; i < invites.length; i++) {
      const user = await this.usersRepository.findOne({
        where: {
          id: invites[i],
        },
      });
      if (!user) {
        throw new BadRequestException('User id incorrect');
      }
      user.invitation = true;
      await this.usersRepository.save(user);
    }
    return 'Invitation Sent';
  }

  async updateCity(city: string, user: UserEntity) {
    // const user = await this.findByCookie(cookie);
    user.invitation = false;
    user.city = city;
    await this.usersRepository.save(user);
    return 'City Updated For User';
  }

  async findById(id: any) {
    return await this.usersRepository.findOne({ where: { id } });
  }

  update(id: number, updateSessionUserDto: any) {
    return `This action updates a #${id} sessionUser`;
  }

  async remove(id: number) {
    return await this.usersRepository.softRemove({ id });
  }
}
