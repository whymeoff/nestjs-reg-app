import { Controller, Post, Body, ParseIntPipe, Patch, Param } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { Participant } from './entities/participant.entity';
import { ParticipantDto } from './dto/participant.dto';

@Controller('participant')
export class ParticipantController {
  constructor(private participantService: ParticipantService) {}

  @Post()
  async registerParticipant(@Body() participantDto: ParticipantDto): Promise<Participant> {
    return this.participantService.registerParticipant(participantDto)
  }

  @Patch('/confirm/:token')
  async confirmEmail(@Param('token') token: string) {
    return this.participantService.confirmEmail(token)
  }
}
