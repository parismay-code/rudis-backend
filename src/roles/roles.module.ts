import { forwardRef, Module } from '@nestjs/common';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/role.entity';
import { User } from 'src/users/user.entity';
import { RolesController } from 'src/roles/roles.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [
    TypeOrmModule.forFeature([Role, User]),
    forwardRef(() => AuthModule),
  ],
  exports: [TypeOrmModule, RolesService],
})
export class RolesModule {}
