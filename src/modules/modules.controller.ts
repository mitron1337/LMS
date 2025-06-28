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
import { ModulesService } from './modules.service';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Modules')
@Controller('courses')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get(':courseId/modules')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Получить модули курса (только для записанных студентов)',
  })
  @ApiParam({ name: 'courseId', description: 'ID курса' })
  @ApiResponse({ status: 200, description: 'Список модулей курса' })
  @ApiResponse({
    status: 403,
    description: 'Доступ запрещен - нужно быть записанным на курс',
  })
  findByCourseId(@Request() req, @Param('courseId') courseId: string) {
    const studentId =
      req.user.role === UserRole.STUDENT ? req.user.id : undefined;
    return this.modulesService.findByCourseId(+courseId, studentId);
  }

  @Post(':courseId/modules')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({
    summary: 'Создать новый модуль (только для админов и учителей)',
  })
  @ApiParam({ name: 'courseId', description: 'ID курса' })
  @ApiBody({ type: CreateModuleDto })
  @ApiResponse({ status: 201, description: 'Модуль успешно создан' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  create(
    @Request() req,
    @Param('courseId') courseId: string,
    @Body() createModuleDto: CreateModuleDto,
  ) {
    createModuleDto.courseId = +courseId;
    return this.modulesService.create(
      createModuleDto,
      req.user.id,
      req.user.role,
    );
  }

  @Put('modules/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Обновить модуль (только для админов и учителей)' })
  @ApiParam({ name: 'id', description: 'ID модуля' })
  @ApiBody({ type: UpdateModuleDto })
  @ApiResponse({ status: 200, description: 'Модуль успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Модуль не найден' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    return this.modulesService.update(
      +id,
      updateModuleDto,
      req.user.id,
      req.user.role,
    );
  }

  @Delete('modules/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Удалить модуль (только для админов и учителей)' })
  @ApiParam({ name: 'id', description: 'ID модуля' })
  @ApiResponse({ status: 200, description: 'Модуль успешно удален' })
  @ApiResponse({ status: 404, description: 'Модуль не найден' })
  remove(@Request() req, @Param('id') id: string) {
    return this.modulesService.remove(+id, req.user.id, req.user.role);
  }
}
