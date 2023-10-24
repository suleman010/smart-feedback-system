import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Body() createReviewDto: any) {
    console.log('chheck', createReviewDto)
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Get('branch/:id')
  findReviewsByBranchId(@Param('id') id: string) {
    return this.reviewService.findReviewsByBranchId(+id);
  }

  @Get('company/:id')
  findReviewsByCompanyId(@Param('id') id: string) {
    return this.reviewService.findReviewsByCompanyId(+id);
  }

  @Get('company/:id/analysis')
  getAnalysisByCompanyId(@Param('id') id: string) {
    return this.reviewService.getAnalysisByCompanyId(+id);
  }

  @Get('all/analysis')
  getAnalysis() {
    console.log('test')
    return this.reviewService.getAnalysis();
  }

  // @Get('branch/:id')
  // findReviewsByBranchId(@Param('id') id: string) {
  //   return this.reviewService.findReviewsByBranchId(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }
}
