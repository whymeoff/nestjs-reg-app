import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs'
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './entities/user.repository';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { ParticipantRepository } from 'src/participant/entities/participant.repository';
import { Participant } from 'src/participant/entities/participant.entity';
import { ParticipantSearchFilterDto } from './dto/participant-search-filter.dto';
import { ParticipantDto } from 'src/participant/dto/participant.dto';
import { UserAuthDto } from './dto/user-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(ParticipantRepository)
    private participantRepository: ParticipantRepository,
    private jwtService: JwtService
  ) {}

  async loginUser(userAuthDto: UserAuthDto) {
    const { email, password } = userAuthDto
    const user = await this.userRepository.findOne({ email })

    if (user && await bcrypt.compare(password, user.password)) {
      const token = this.jwtService.sign({ email })
      return { token }
    } else {
      throw new UnauthorizedException('Invalid credentials')
    }
  }

  async createUser(userDto: UserDto): Promise<User> {
    return await this.userRepository.createOne(userDto)
  }

  async updateUser(id: number, userDto: UserDto): Promise<User> {
    return this.userRepository.updateOne(id, userDto)
  }

  async getUser(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ id })

    if (!user) {
      throw new NotFoundException(`Cant find user by ID ${id}`)
    }

    delete user.password

    return user
  }

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.find()

    return users
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({ id })

    if (!user) {
      throw new NotFoundException(`Cant find and delete user by ID ${id}`)
    }

    await this.userRepository.remove(user)

    return { message: 'User deleted successfuly' }
  }

  async getParticipant(id: number): Promise<Participant> {
    const participant = await this.participantRepository.findOne({ id })

    if (!participant) {
      throw new NotFoundException(`Cant find participant with ID ${id}`)
    }

    return participant
  }

  async getParticipants(participantSearchFilterDto: ParticipantSearchFilterDto): Promise<Participant[]> {
    return this.participantRepository.findMany(participantSearchFilterDto)
  }

  async updateParticipant(id: number, participantDto: ParticipantDto): Promise<Participant> {
    return await this.participantRepository.updateOne(id, participantDto)
  }
}
