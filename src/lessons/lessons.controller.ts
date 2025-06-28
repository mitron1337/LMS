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
  ApiParam,
} from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Lessons')
@Controller('modules')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get(':moduleId/lessons')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Получить уроки модуля (только для записанных студентов)',
  })
  @ApiParam({ name: 'moduleId', description: 'ID модуля' })
  @ApiResponse({ status: 200, description: 'Список уроков модуля' })
  @ApiResponse({
    status: 403,
    description: 'Доступ запрещен - нужно быть записанным на курс',
  })
  findByModuleId(@Request() req, @Param('moduleId') moduleId: string) {
    const studentId =
      req.user.role === UserRole.STUDENT ? req.user.id : undefined;
    return this.lessonsService.findByModuleId(+moduleId, studentId);
  }

  @Post(':moduleId/lessons')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({
    summary: 'Создать новый урок (только для админов и учителей)',
  })
  @ApiParam({ name: 'moduleId', description: 'ID модуля' })
  @ApiBody({ type: CreateLessonDto })
  @ApiResponse({ status: 201, description: 'Урок успешно создан' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  create(
    @Request() req,
    @Param('moduleId') moduleId: string,
    @Body() createLessonDto: CreateLessonDto,
  ) {
    createLessonDto.moduleId = +moduleId;
    return this.lessonsService.create(
      createLessonDto,
      req.user.id,
      req.user.role,
    );
  }

  @Put('lessons/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Обновить урок (только для админов и учителей)' })
  @ApiParam({ name: 'id', description: 'ID урока' })
  @ApiBody({ type: UpdateLessonDto })
  @ApiResponse({ status: 200, description: 'Урок успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Урок не найден' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonsService.update(
      +id,
      updateLessonDto,
      req.user.id,
      req.user.role,
    );
  }

  @Delete('lessons/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Удалить урок (только для админов и учителей)' })
  @ApiParam({ name: 'id', description: 'ID урока' })
  @ApiResponse({ status: 200, description: 'Урок успешно удален' })
  @ApiResponse({ status: 404, description: 'Урок не найден' })
  remove(@Request() req, @Param('id') id: string) {
    return this.lessonsService.remove(+id, req.user.id, req.user.role);
  }
}
