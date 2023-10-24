import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth/jwt-auth.guard';
import { Role } from 'src/user/guards/role.enum';
import { RoleGuard } from 'src/user/guards/role.guard';
import { AllowedRoles } from 'src/user/guards/roles.decorator';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyEntity } from './entities/company.entity';

@ApiTags('companies')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }
  
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @AllowedRoles(Role.SuperAdmin)
  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<CompanyEntity> {
    return this.companyService.create(createCompanyDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @AllowedRoles(Role.SuperAdmin, Role.CompanyAdmin)
  @Get()
  async findAll(@Req() req: Request) {
    let user:any = req.user
    return this.companyService.findAll(user.id); 
  }

  
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @AllowedRoles(Role.SuperAdmin, Role.CompanyAdmin)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<CompanyEntity> {
    return this.companyService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @AllowedRoles(Role.SuperAdmin, Role.CompanyAdmin)
  @Get(':id/reviews')
  async findAllReviews(@Param('id') id: number): Promise<CompanyEntity> {
    return this.companyService.findAllReviews(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCompanyDto: UpdateCompanyDto
  ): Promise<CompanyEntity> {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.companyService.remove(id);
  }

}
