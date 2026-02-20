import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ProjectService } from '../project/project.service';
import { UserService } from '../user/user.service';
import { ApiTags, ApiResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { Task } from './entities/task.entity';

@ApiTags('task')
@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  // --- CREATE ---
  @ApiResponse({
    status: 201,
    description: 'Task créée avec succès',
  })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      await this.projectService.findOneWithTask(createTaskDto.project_id);
    } catch (e) {
      throw new NotFoundException(
        `Project avec l'ID ${createTaskDto.project_id} introuvable`,
      );
    }

    if (createTaskDto.user_id) {
      try {
        await this.userService.findOne(createTaskDto.user_id);
      } catch (e) {
        throw new NotFoundException(
          `User avec l'ID ${createTaskDto.user_id} introuvable`,
        );
      }
    }
    return this.taskService.create(createTaskDto);
  }

  // --- READ ALL ---
  @ApiResponse({
    status: 200,
    description: 'Liste des tasks récupérées avec succès',
  })
  @ApiResponse({ status: 404, description: 'Task introuvable' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  // --- READ ONE ---
  @ApiResponse({
    status: 200,
    description: 'Task trouvée',
  })
  @ApiResponse({ status: 404, description: 'Task introuvable' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  // --- READ ONE ---
  @ApiResponse({
    status: 200,
    description: 'Task trouvée',
  })
  @ApiResponse({ status: 404, description: 'Task introuvable' })
  @Get(':id')
  findOneTaskByProject(@Param('id') id: string) {
    return this.taskService.findOneTaskByProject(+id);
  }

  @ApiResponse({
    status: 200,
    description: 'Task mise à jour avec succès',
  })
  @ApiResponse({ status: 404, description: 'Task introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    // Si project_id est modifié, vérifier son existence
    if (updateTaskDto.project_id) {
      const project = await this.projectService.findOneWithTask(
        updateTaskDto.project_id,
      );
      if (!project) {
        throw new NotFoundException(
          `Project avec l'ID ${updateTaskDto.project_id} introuvable`,
        );
      }
    }

    // Note: Vérification de user_id si modifié
    if (updateTaskDto.user_id) {
      const user = await this.userService.findOne(updateTaskDto.user_id);
      if (!user) {
        throw new NotFoundException(
          `User avec l'ID ${updateTaskDto.user_id} introuvable`,
        );
      }
    }

    return this.taskService.update(+id, updateTaskDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Task supprimée avec succès',
  })
  @ApiResponse({ status: 404, description: 'Task introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }

  @ApiResponse({
    status: 200,
    description: 'Liste des professions de la task récupérées avec succès',
  })
  @ApiResponse({ status: 404, description: 'Task introuvable' })
  @Get(':id/professions')
  async getProfessions(@Param('id') id: string) {
    const professions = await this.taskService.getProfessions(+id);
    if (!professions) {
      throw new NotFoundException(`Task avec l'ID ${id} introuvable`);
    }
    return professions;
  }

  @ApiResponse({
    status: 201,
    description: 'Professions ajoutées à la task avec succès',
  })
  @ApiResponse({ status: 404, description: 'Task ou profession introuvable' })
  @Post(':id/professions')
  async addProfessions(
    @Param('id') id: string,
    @Body() body: { profession_ids: number[] },
  ) {
    const task = await this.taskService.findOne(+id);
    if (!task) {
      throw new NotFoundException(`Task avec l'ID ${id} introuvable`);
    }

    // TODO: Vérifier que toutes les professions existent
    return this.taskService.addProfessions(+id, body.profession_ids);
  }

  @ApiResponse({
    status: 200,
    description: 'Profession supprimée de la task avec succès',
  })
  @ApiResponse({ status: 404, description: 'Task ou profession introuvable' })
  @Delete(':id/professions/:professionId')
  async removeProfession(
    @Param('id') id: string,
    @Param('professionId') professionId: string,
  ) {
    return this.taskService.removeProfession(+id, +professionId);
  }
}
