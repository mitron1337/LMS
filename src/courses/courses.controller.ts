import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
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
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все курсы' })
  @ApiResponse({ status: 200, description: 'Список всех курсов' })
  findAll() {
    return this.coursesService.findAll();
  }

  @Get('my-courses')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Получить мои курсы (только для учителей)' })
  @ApiResponse({ status: 200, description: 'Список курсов учителя' })
  getMyCourses(@Request() req) {
    return this.coursesService.findTeacherCourses(req.user.id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({
    summary: 'Создать новый курс (только для админов и учителей)',
  })
  @ApiBody({ type: CreateCourseDto })
  @ApiResponse({ status: 201, description: 'Курс успешно создан' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  create(@Request() req, @Body() createCourseDto: CreateCourseDto) {
    if (req.user.role === UserRole.TEACHER) {
      createCourseDto.teacherUserId = req.user.id;
    }
    return this.coursesService.create(
      createCourseDto,
      req.user.id,
      req.user.role,
    );
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Обновить курс (только для админов и учителей)' })
  @ApiBody({ type: UpdateCourseDto })
  @ApiResponse({ status: 200, description: 'Курс успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Курс не найден' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(
      +id,
      updateCourseDto,
      req.user.id,
      req.user.role,
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Удалить курс (только для админов и учителей)' })
  @ApiResponse({ status: 200, description: 'Курс успешно удален' })
  @ApiResponse({ status: 404, description: 'Курс не найден' })
  remove(@Request() req, @Param('id') id: string) {
    return this.coursesService.remove(+id, req.user.id, req.user.role);
  }
}
