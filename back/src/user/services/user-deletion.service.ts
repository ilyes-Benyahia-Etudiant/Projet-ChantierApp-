import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserDeletionService {
  constructor(private prisma: PrismaService) {}

  async deleteUserCascade(userId: number) {
    // Supprime en cascade toutes les entités liées à l'utilisateur
    // (professions, notifications, tokens, tâches, projets, devis, factures, profils)
    await this.prisma.$transaction(async (prismaTx) => {
      // Détache les professions liées aux profils de l'utilisateur
      await prismaTx.profileHasProfession.deleteMany({
        where: { profile: { user_id: userId } },
      });

      // Supprime les notifications reçues par l'utilisateur
      await prismaTx.userReceivesNotifications.deleteMany({
        where: { user_id: userId },
      });

      // Supprime tous les refresh tokens de l'utilisateur
      await prismaTx.refreshToken.deleteMany({ where: { user_id: userId } });

      // Détache l'utilisateur des tâches (évite contrainte de FK)
      await prismaTx.task.updateMany({
        where: { user_id: userId },
        data: { user_id: null },
      });

      // Filtre projets où l'utilisateur est client ou entreprise
      const projectOwnerFilter = {
        OR: [{ customer_id: userId }, { entreprise_id: userId }],
      };

      // Supprime les professions liées aux tâches des projets concernés
      await prismaTx.taskHasProfession.deleteMany({
        where: { task: { project: projectOwnerFilter } },
      });
      // Supprime les tâches des projets concernés
      await prismaTx.task.deleteMany({
        where: { project: projectOwnerFilter },
      });

      // Supprime les factures et lignes liées aux devis du user ou de ses projets
      await prismaTx.invoice.deleteMany({
        where: {
          OR: [
            { estimate: { project: projectOwnerFilter } },
            { estimate: { user_id: userId } },
          ],
        },
      });
      await prismaTx.line.deleteMany({
        where: {
          OR: [
            { estimate: { project: projectOwnerFilter } },
            { estimate: { user_id: userId } },
          ],
        },
      });
      // Supprime les devis liés aux projets du user ou créés par le user
      await prismaTx.estimate.deleteMany({
        where: {
          OR: [{ project: projectOwnerFilter }, { user_id: userId }],
        },
      });

      // Supprime les projets où l'utilisateur est propriétaire
      await prismaTx.project.deleteMany({ where: projectOwnerFilter });

      // Supprime les profils associés à l'utilisateur
      await prismaTx.profile.deleteMany({ where: { user_id: userId } });

      // Supprime l'utilisateur lui-même
      await prismaTx.user.delete({ where: { id: userId } });
    });
  }
}
