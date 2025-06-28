import {
  Controller,
  Post,
  Get,
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
import { AssignmentsService } from './assignments.service';
import { SubmitAssignmentDto, GradeAssignmentDto } from './dto/assignment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Assignments')
@Controller('modules')
@UseGuards(JwtAuthGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post(':moduleId/assignment')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Сдать задание (только для студентов)' })
  @ApiParam({ name: 'moduleId', description: 'ID модуля' })
  @ApiBody({ type: SubmitAssignmentDto })
  @ApiResponse({ status: 201, description: 'Задание успешно сдано' })
  @ApiResponse({
    status: 403,
    description: 'Доступ запрещен - нужно быть записанным на курс',
  })
  @ApiResponse({ status: 404, description: 'Модуль не найден' })
  async submitAssignment(
    @Request() req,
    @Param('moduleId') moduleId: string,
    @Body() submitAssignmentDto: SubmitAssignmentDto,
  ) {
    submitAssignmentDto.moduleId = +moduleId;
    return this.assignmentsService.submitAssignment(
      req.user.id,
      submitAssignmentDto,
    );
  }

  @Post('assignments/:assignmentId/grade')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Оценить задание (только для админов)' })
  @ApiParam({ name: 'assignmentId', description: 'ID задания' })
  @ApiBody({ type: GradeAssignmentDto })
  @ApiResponse({ status: 200, description: 'Задание успешно оценено' })
  @ApiResponse({ status: 404, description: 'Задание не найдено' })
  async gradeAssignment(
    @Param('assignmentId') assignmentId: string,
    @Body() gradeAssignmentDto: GradeAssignmentDto,
  ) {
    return this.assignmentsService.gradeAssignment(
      +assignmentId,
      gradeAssignmentDto,
    );
  }

  @Get('my-assignments')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Получить мои задания (только для студентов)' })
  @ApiResponse({ status: 200, description: 'Список заданий студента' })
  async getMyAssignments(@Request() req) {
    return this.assignmentsService.getStudentAssignments(req.user.id);
  }

  @Get(':moduleId/assignments')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Получить задания модуля (только для админов)' })
  @ApiParam({ name: 'moduleId', description: 'ID модуля' })
  @ApiResponse({ status: 200, description: 'Список заданий модуля' })
  async getModuleAssignments(@Param('moduleId') moduleId: string) {
    return this.assignmentsService.getModuleAssignments(+moduleId);
  }
}
