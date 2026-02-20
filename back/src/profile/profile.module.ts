import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AddressModule } from '../address/address.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [AddressModule, UserModule],
  controllers: [ProfileController],
  providers: [ProfileService, PrismaService],
  exports: [ProfileService],
})
export class ProfileModule {}
