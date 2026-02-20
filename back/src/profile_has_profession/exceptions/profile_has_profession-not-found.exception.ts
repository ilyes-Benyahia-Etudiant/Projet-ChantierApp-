import { NotFoundException } from '@nestjs/common';

export class ProfileHasProfessionNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`ProfileHasProfession avec l'ID ${id} introuvable`);
  }
}
