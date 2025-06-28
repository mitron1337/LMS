import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StudentCoursesService } from './student-courses.service';
import { EnrollCourseDto } from './dto/student-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Enrollments')
@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class StudentCoursesController {
  constructor(private readonly studentCoursesService: StudentCoursesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Записаться на курс (только для студентов)' })
  @ApiBody({ type: EnrollCourseDto })
  @ApiResponse({ status: 201, description: 'Успешно записались на курс' })
  @ApiResponse({ status: 409, description: 'Уже записаны на этот курс' })
  @ApiResponse({ status: 404, description: 'Курс не найден' })
  async enrollCourse(@Request() req, @Body() enrollCourseDto: EnrollCourseDto) {
    return this.studentCoursesService.enrollStudent(
      req.user.id,
      enrollCourseDto,
    );
  }

  @Get('my-courses')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Получить мои курсы (только для студентов)' })
  @ApiResponse({ status: 200, description: 'Список курсов студента' })
  async getMyCourses(@Request() req) {
    return this.studentCoursesService.getStudentCourses(req.user.id);
  }
}
