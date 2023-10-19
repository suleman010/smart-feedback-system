import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionService } from './question.service';
import { QuestionEntity } from './entities/question.entity';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  create(@Body() createQuestionDto: {companyId: number, text: string}) {
    return this.questionService.create(createQuestionDto.companyId, createQuestionDto.text);
  }

  @Get()
  findAll() {
    return this.questionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<QuestionEntity> {
    return this.questionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(+id);
  }
}
