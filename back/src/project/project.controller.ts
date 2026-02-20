import { TaskService } from './../task/task.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
  UseGuards,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddressService } from '../address/address.service';
import { UserService } from '../user/user.service';
import {
  ApiTags,
  ApiResponse,
  ApiForbiddenResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateTaskDto } from '../task/dto/create-task.dto';
import { UpdateTaskDto } from '../task/dto/update-task.dto';
import {
  OwnerOrAdmin,
  ProjectOwnerOrAdmin,
} from '../auth/decorators/resource-access.decorator';
import { ResourceAccessGuard } from '../auth/guards/resource-access.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { userRole } from '../user/enum/role.enum';
import { Prisma } from '@prisma/client';

@ApiTags('project')
@UseGuards(AuthGuard, RolesGuard, ResourceAccessGuard)
@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly addressService: AddressService,
    private readonly userService: UserService,
    private readonly taskService: TaskService,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'Project créé avec succès',
  })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    // Vérification de l'existence de address_id
    const address = await this.addressService.findOne(
      createProjectDto.address_id,
    );
    if (!address) {
      throw new NotFoundException(
        `Address avec l'ID ${createProjectDto.address_id} introuvable`,
      );
    }

    // Vérification de l'existence de customer_id
    const customer = await this.userService.findOne(
      createProjectDto.customer_id,
    );
    if (!customer) {
      throw new NotFoundException(
        `User avec l'ID ${createProjectDto.customer_id} introuvable`,
      );
    }
    if (customer.role !== 'customer') {
      throw new BadRequestException(
        `User avec l'ID ${createProjectDto.customer_id} n'a pas le rôle customer`,
      );
    }

    // Vérification de l'existence de entreprise_id (si fourni)
    if (createProjectDto.entreprise_id) {
      const entreprise = await this.userService.findOne(
        createProjectDto.entreprise_id,
      );
      if (!entreprise) {
        throw new NotFoundException(
          `User avec l'ID ${createProjectDto.entreprise_id} introuvable`,
        );
      }
      if (entreprise.role !== 'entreprise') {
        throw new BadRequestException(
          `User avec l'ID ${createProjectDto.entreprise_id} n'a pas le rôle entreprise`,
        );
      }
    }

    return this.projectService.create(createProjectDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Recherche de projets',
  })
  @ApiQuery({
    name: 'status',
    enum: ['all', 'new', 'accepted', 'finished'],
    required: false,
  })
  @Roles(userRole.Admin, userRole.Entreprise, userRole.Customer)
  @Get('search')
  async search(
    @Query('status') status: 'all' | 'new' | 'accepted' | 'finished' = 'all',
    @Req() req: any,
  ) {
    const userId = req.user.id;
    let where: Prisma.ProjectWhereInput = {};

    switch (status) {
      case 'new':
        where = { is_finished: false, entreprise_id: null };
        break;
      case 'accepted':
        where = { is_finished: false, entreprise_id: userId };
        break;
      case 'finished':
        where = {
          is_finished: true,
          OR: [{ entreprise_id: userId }, { customer_id: userId }],
        };
        break;
      case 'all':
      default:
        where = {
          OR: [
            { entreprise_id: null, is_finished: false },
            { entreprise_id: userId },
            { customer_id: userId },
          ],
        };
        break;
    }

    return this.projectService.findAll({ where });
  }

  @ApiResponse({
    status: 200,
    description: 'Liste des projects récupérés avec succès',
  })
  @ApiResponse({ status: 404, description: 'Project introuvable' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @Roles(userRole.Admin, userRole.Entreprise)
  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Liste des projects pour un utilisateur récupérés avec succès',
  })
  @ApiResponse({ status: 404, description: 'Utilisateur introuvable' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @OwnerOrAdmin('userId')
  @Get('user/:userId')
  async findAllByUserId(@Param('userId') userId: string) {
    const user = await this.userService.findOne(+userId);
    if (!user) {
      throw new NotFoundException(`User avec l'ID ${userId} introuvable`);
    }
    return this.projectService.findAllByUserId(+userId);
  }

  @ApiResponse({ status: 404, description: 'Project introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @ProjectOwnerOrAdmin('id')
  @Get(':id/tasks')
  findOneWithTask(@Param('id') id: string) {
    return this.projectService.findOneWithTask(+id);
  }

  @ApiResponse({
    status: 200,
    description: 'Project accepté avec succès',
  })
  @ApiResponse({ status: 404, description: 'Project introuvable' })
  @ApiResponse({ status: 400, description: 'Project déjà assigné ou invalide' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Entreprise)
  @Post(':id/accept')
  async accept(@Param('id') id: string, @Req() req: any) {
    const project = await this.projectService.findOneWithTask(+id);
    if (!project) {
      throw new NotFoundException(`Project avec l'ID ${id} introuvable`);
    }

    // Vérifier si le projet est déjà assigné
    if (project.entreprise_id !== null) {
      throw new BadRequestException(`Project déjà assigné à une entreprise`);
    }

    // Vérifier si le projet est terminé
    if (project.is_finished) {
      throw new BadRequestException(`Project déjà terminé`);
    }

    return this.projectService.accept(+id, req.user.id);
  }

  @ApiResponse({
    status: 200,
    description: 'Project mis à jour avec succès',
  })
  @ApiResponse({ status: 404, description: 'Project introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @ProjectOwnerOrAdmin('id')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    // Si customer_id ou entreprise_id sont modifiés, vérifier les rôles quand User sera complété
    // if (updateProjectDto.customer_id) {
    //   const customer = await this.userService.findOne(updateProjectDto.customer_id);
    //   if (!customer) {
    //     throw new NotFoundException(`User avec l'ID ${updateProjectDto.customer_id} introuvable`);
    //   }
    //   if (customer.role !== 'customer') {
    //     throw new BadRequestException(`User avec l'ID ${updateProjectDto.customer_id} n'a pas le rôle customer`);
    //   }
    // }

    // if (updateProjectDto.entreprise_id) {
    //   const entreprise = await this.userService.findOne(updateProjectDto.entreprise_id);
    //   if (!entreprise) {
    //     throw new NotFoundException(`User avec l'ID ${updateProjectDto.entreprise_id} introuvable`);
    //   }
    //   if (entreprise.role !== 'entreprise') {
    //     throw new BadRequestException(`User avec l'ID ${updateProjectDto.entreprise_id} n'a pas le rôle entreprise`);
    //   }
    // }

    return this.projectService.update(+id, updateProjectDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Project supprimé avec succès',
  })
  @ApiResponse({ status: 404, description: 'Project introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @ProjectOwnerOrAdmin('id')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }

  // --- GESTION DES TASKS DU PROJECT ---

  @ApiResponse({
    status: 200,
    description: 'Liste des tasks du projet récupérées avec succès',
  })
  @ApiResponse({ status: 404, description: 'Project introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @ProjectOwnerOrAdmin('id')
  @Get(':id/task')
  async getAllTasks(@Param('id') projectId: string) {
    const project = await this.projectService.findOneWithTask(+projectId);
    if (!project) {
      throw new NotFoundException(`Project avec l'ID ${projectId} introuvable`);
    }
    return this.taskService.findAll({ where: { project_id: +projectId } });
  }

  @ApiResponse({
    status: 200,
    description: 'Task trouvée',
  })
  @ApiResponse({ status: 404, description: 'Task ou Project introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @ProjectOwnerOrAdmin('id')
  @Get(':id/task/:taskId')
  async getOneTask(
    @Param('id') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    const project = await this.projectService.findOneWithTask(+projectId);

    if (!project) {
      throw new NotFoundException(`Project avec l'ID ${projectId} introuvable`);
    }

    // Récupérer la tâche et vérifier qu'elle appartient au projet
    const task = await this.taskService.findOne(+taskId);
    if (task.project_id !== +projectId) {
      throw new NotFoundException(
        `Task avec l'ID ${taskId} introuvable dans le project ${projectId}`,
      );
    }
    return task;
  }

  @ApiResponse({
    status: 201,
    description: 'Task créée avec succès',
  })
  @ApiResponse({ status: 404, description: 'Project introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @ProjectOwnerOrAdmin('id')
  @Post(':id/task')
  async createTask(
    @Param('id') projectId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    const project = await this.projectService.findOneWithTask(+projectId);
    if (!project) {
      throw new NotFoundException(`Project avec l'ID ${projectId} introuvable`);
    }

    // Forcer le project_id à celui de la route
    createTaskDto.project_id = +projectId;

    return this.taskService.create(createTaskDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Task mise à jour avec succès',
  })
  @ApiResponse({ status: 404, description: 'Task ou Project introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @ProjectOwnerOrAdmin('id')
  @Patch(':id/task/:taskId')
  async updateTask(
    @Param('id') projectId: string,
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const project = await this.projectService.findOneWithTask(+projectId);
    if (!project) {
      throw new NotFoundException(`Project avec l'ID ${projectId} introuvable`);
    }

    // Vérifier que la tâche existe et appartient au projet
    const task = await this.taskService.findOne(+taskId);
    if (task.project_id !== +projectId) {
      throw new NotFoundException(
        `Task avec l'ID ${taskId} introuvable dans le project ${projectId}`,
      );
    }

    return this.taskService.update(+taskId, updateTaskDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Task supprimée avec succès',
  })
  @ApiResponse({ status: 404, description: 'Task ou Project introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @ProjectOwnerOrAdmin('id')
  @Delete(':id/task/:taskId')
  async removeTask(
    @Param('id') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    const project = await this.projectService.findOneWithTask(+projectId);
    if (!project) {
      throw new NotFoundException(`Project avec l'ID ${projectId} introuvable`);
    }

    // Vérifier que la tâche existe et appartient au projet
    const task = await this.taskService.findOne(+taskId);
    if (task.project_id !== +projectId) {
      throw new NotFoundException(
        `Task avec l'ID ${taskId} introuvable dans le project ${projectId}`,
      );
    }

    return this.taskService.remove(+taskId);
  }
}
