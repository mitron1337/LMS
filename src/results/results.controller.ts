import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ResultsService } from './results.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Results')
@Controller('results')
@UseGuards(JwtAuthGuard)
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Получить мои результаты (только для студентов)' })
  @ApiResponse({ status: 200, description: 'Список результатов студента' })
  async getMyResults(@Request() req) {
    return this.resultsService.getStudentResults(req.user.id);
  }

  @Post('calculate/:courseId')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({
    summary: 'Рассчитать результат по курсу (только для студентов)',
  })
  @ApiParam({ name: 'courseId', description: 'ID курса' })
  @ApiResponse({ status: 200, description: 'Результат успешно рассчитан' })
  @ApiResponse({ status: 404, description: 'Оцененные задания не найдены' })
  async calculateCourseResult(
    @Request() req,
    @Param('courseId') courseId: string,
  ) {
    return this.resultsService.calculateCourseResult(req.user.id, +courseId);
  }

  @Get('course/:courseId')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Получить результаты курса (только для админов)' })
  @ApiParam({ name: 'courseId', description: 'ID курса' })
  @ApiResponse({ status: 200, description: 'Список результатов курса' })
  async getCourseResults(@Param('courseId') courseId: string) {
    return this.resultsService.getCourseResults(+courseId);
  }
}
