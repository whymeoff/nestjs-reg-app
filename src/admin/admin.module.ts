import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './entities/user.repository'
import { ParticipantRepository } from 'src/participant/entities/participant.repository';
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { RoleRepository } from 'src/roles/role.repository';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    JwtStrategy
  ],
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.register({
      secret: 'Secret',
      signOptions: {
        expiresIn: 3600
      }
    }),
    TypeOrmModule.forFeature([UserRepository, ParticipantRepository, RoleRepository])
  ],
  exports: [
    JwtStrategy,
    PassportModule
  ]
})
export class AdminModule {}
