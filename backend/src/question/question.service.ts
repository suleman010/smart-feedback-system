import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionEntity } from './entities/question.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyService } from 'src/company/company.service';
import { In } from 'typeorm';

@Injectable()
export class QuestionService {

  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
    private companyService: CompanyService,
  ) {}

  async create(companyId: number, text: string): Promise<QuestionEntity> {
    const question = await this.questionRepository.create({ text });

    question.company = await this.companyService.findOne(companyId);
    if(!question.company){
      throw new NotFoundException('Company Not Found')
    }
    return await this.questionRepository.save(question);
  }

  async getQuestionsForCompany(companyId: number): Promise<QuestionEntity[]> {
    return await this.questionRepository.find({ where: { company: { id: companyId } } });
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

  async getQuestionsByCompanyId(companyId: number): Promise<QuestionEntity[]> {
    const questions = await this.questionRepository.find({
      where: { company: { id: companyId } },
    });
  
    if (!questions || questions.length === 0) {
      throw new NotFoundException(`Questions for company ID ${companyId} not found`);
    }
  
    return questions;
  }
  
  async findByIds(questionIds: number[]):  Promise<QuestionEntity[]>  {
    const questions = await this.questionRepository.find({
      where: { id: In(questionIds) },
    });

    if (!questions) {
      throw new NotFoundException('questions were not found');
    }
    return questions; 
  }

  
  async update(id: number, updateQuestionDto: UpdateQuestionDto): Promise<QuestionEntity> {
    const existingQuestion = await this.questionRepository.findOne({ where:{id}});

    if (!existingQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    // Update the question properties with data from the DTO
    this.questionRepository.merge(existingQuestion, updateQuestionDto);

    const updatedQuestion = await this.questionRepository.save(existingQuestion);

    return updatedQuestion;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
