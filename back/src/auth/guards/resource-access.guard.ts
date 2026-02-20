import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  RESOURCE_ACCESS_KEY,
  ResourceAccessConfig,
} from '../decorators/resource-access.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ResourceAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const config = this.reflector.getAllAndOverride<ResourceAccessConfig>(
      RESOURCE_ACCESS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!config) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new UnauthorizedException(
        'Authentification requise pour cette ressource.',
      );
    }

    // Ici on vérifie si l'user est admin
    if (config.allowedRoles && config.allowedRoles.length > 0) {
      if (user.role && config.allowedRoles.includes(user.role)) {
        return true;
      }
    }

    // Ici on vérifie si l'utilisateur est le propriétaire de la ressource
    if (config.allowOwner) {
      const ownerParam = config.ownerParam || 'id';
      const resourceId = request.params[ownerParam];

      if (!resourceId) {
        throw new ForbiddenException(
          `Paramètre ${ownerParam} manquant dans la route.`,
        );
      }

      const currentUserId = user.id;

      // Cas simple : vérification directe (ex: /users/:id)
      if (!config.resourceType || config.resourceType === 'user') {
        const isOwner = currentUserId === +resourceId;
        if (isOwner) {
          return true;
        }
      }

      // Cas complexe : aller chercher la ressource en DB
      if (config.resourceType && config.ownerFields) {
        const isOwner = await this.checkResourceOwnership(
          config.resourceType,
          +resourceId,
          currentUserId,
          config.ownerFields,
        );

        if (isOwner) {
          return true;
        }
      }
    }

    throw new ForbiddenException(
      "Vous n'avez pas les droits nécessaires pour accéder à cette ressource.",
    );
  }

  /**
   * Vérifie si l'utilisateur est propriétaire de la ressource
   * en allant chercher la ressource en DB
   */
  private async checkResourceOwnership(
    resourceType: string,
    resourceId: number,
    userId: number,
    ownerFields: string[],
  ): Promise<boolean> {
    try {
      let resource: any;

      switch (resourceType) {
        case 'project':
          resource = await this.prisma.project.findUnique({
            where: { id: resourceId },
            select: {
              customer_id: true,
              entreprise_id: true,
            },
          });
          break;

        case 'task':
          resource = await this.prisma.task.findUnique({
            where: { id: resourceId },
            select: {
              user_id: true,
            },
          });
          break;

        case 'address':
          // Pour address, on pourrait vérifier via le profile associé
          // À adapter selon vos besoins
          return false;

        default:
          return false;
      }

      if (!resource) {
        throw new ForbiddenException('Ressource non trouvée.');
      }

      // Vérifier si l'userId correspond à un des champs owner
      return ownerFields.some((field) => resource[field] === userId);
    } catch (error) {
      throw new ForbiddenException(
        'Erreur lors de la vérification des droits.',
      );
    }
  }
}
