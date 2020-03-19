import { Module } from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantRepository } from './entities/participant.repository';
import { JwtModule } from '@nestjs/jwt'

@Module({
  controllers: [ParticipantController],
  providers: [ParticipantService],
  imports: [
    JwtModule.register({
      secret: 'Secret',
      signOptions: {
        expiresIn: 600
      }
    }),
    TypeOrmModule.forFeature([ParticipantRepository])
  ]
})
export class ParticipantModule {}
