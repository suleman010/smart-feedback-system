import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionEntity } from './entities/question.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyService } from 'src/company/company.service';

@Injectable()
export class QuestionService {

  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
    private companyService: CompanyService,
  ) {}

  async create(companyId: number, text: string): Promise<QuestionEntity> {
    const question = this.questionRepository.create({ text });

    question.company = await this.companyService.findOne(companyId);
    if(!question.company){
      throw new NotFoundException('Company Not Found')
    }
    return this.questionRepository.save(question);
  }

  async getQuestionsForCompany(companyId: number): Promise<QuestionEntity[]> {
    return this.questionRepository.find({ where: { company: { id: companyId } } });
  }
  
  
  findAll() {
    return `This action returns all question`;
  }
  
  async findOne(id: number):  Promise<QuestionEntity>  {
    const question = await this.questionRepository.findOne({ where: { id: id } });
    if(!question || question == null){
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
