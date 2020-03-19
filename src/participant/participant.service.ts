import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParticipantRepository } from './entities/participant.repository';
import { ParticipantDto } from './dto/participant.dto';
import { Participant } from './entities/participant.entity';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(ParticipantRepository)
    private participantRepository: ParticipantRepository,
    private jwtService: JwtService,
  ) {}

  async registerParticipant(
    participantDto: ParticipantDto,
  ): Promise<Participant> {
    const participant = await this.participantRepository.createOne(
      participantDto,
    );

    const token = this.jwtService.sign({ email: participant.email });

    const transporter = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '1430c17a226c8a',
        pass: 'e41c58b77f6759',
      },
    });

    const message = {
      from: 'regapp@gmail.com',
      to: participant.email,
      subject: 'Email confirmation from RegApp',
      text: `localhost:3000/participant/confirm/${token}`,
    };

    transporter.sendMail(message);

    return participant;
  }

  async confirmEmail(token: string) {
    const verifiedToken = this.jwtService.verify(token)
    const participant = await this.participantRepository.findOne({ email: verifiedToken.email })

    if (!participant) {
      throw new BadRequestException('Invalid token')
    }

    participant.accountStatus = 'active'
    await participant.save()

    return { message: 'Successful email confirmation' }
  }
}
