import { NotFoundException } from '@nestjs/common';

export class ProjectNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Project avec l'ID ${id} introuvable`);
  }
}
