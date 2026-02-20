import { Module } from '@nestjs/common';
import { ProfileHasProfessionService } from './profile_has_profession.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProfileModule } from '../profile/profile.module';
import { ProfessionModule } from '../profession/profession.module';

@Module({
  imports: [ProfileModule, ProfessionModule],
  controllers: [],
  providers: [ProfileHasProfessionService, PrismaService],
  exports: [ProfileHasProfessionService],
})
export class ProfileHasProfessionModule {}
