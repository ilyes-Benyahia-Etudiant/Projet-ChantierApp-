import { SetMetadata } from '@nestjs/common';
import { userRole } from '../../user/enum/role.enum';

export const RESOURCE_ACCESS_KEY = 'resource_access';

export interface ResourceAccessConfig {
  allowedRoles?: userRole[];
  allowOwner?: boolean;
  ownerParam?: string;
  // Pour les ressources complexes : spécifier les champs à vérifier dans la ressource
  // Ex: ['customer_id', 'entreprise_id'] pour Project
  ownerFields?: string[];
  // Type de ressource pour aller chercher en DB si nécessaire
  resourceType?: 'user' | 'project' | 'address' | 'task';
}

/**
 * Décorateur pour définir les règles d'accès à une ressource
 *
 * @example
 * // Seul l'admin peut accéder
 * @ResourceAccess({ allowedRoles: [userRole.admin] })
 *
 * @example
 * // L'admin OU le propriétaire de la ressource peuvent accéder
 * @ResourceAccess({ allowedRoles: [userRole.admin], allowOwner: true, ownerParam: 'id' })
 *
 * @example
 * // Le propriétaire peut accéder à sa propre ressource uniquement
 * @ResourceAccess({ allowOwner: true, ownerParam: 'id' })
 *
 * @example
 * // Custom param name (ex: projectId au lieu de id)
 * @ResourceAccess({ allowOwner: true, ownerParam: 'projectId' })
 */
export const ResourceAccess = (config: ResourceAccessConfig) =>
  SetMetadata(RESOURCE_ACCESS_KEY, config);

/**
 * Raccourci pour le cas le plus courant : Admin OU propriétaire
 *
 * @example
 * @OwnerOrAdmin('id') // Pour user profile
 * @OwnerOrAdmin('projectId') // Pour project
 */
export const OwnerOrAdmin = (ownerParam: string = 'id') =>
  ResourceAccess({
    allowedRoles: [userRole.Admin],
    allowOwner: true,
    ownerParam,
  });

/**
 * Raccourci pour les projets : Admin OU customer OU entreprise
 *
 * @example
 * @ProjectOwnerOrAdmin('id')
 */
export const ProjectOwnerOrAdmin = (ownerParam: string = 'id') =>
  ResourceAccess({
    allowedRoles: [userRole.Admin],
    allowOwner: true,
    ownerParam,
    ownerFields: ['customer_id', 'entreprise_id'],
    resourceType: 'project',
  });

export const TaskOwnerOrAdmin = (ownerParam: string = 'id') =>
  ResourceAccess({
    allowedRoles: [userRole.Admin],
    allowOwner: true,
    ownerParam,
    ownerFields: ['user_id'],
    resourceType: 'task',
  });
