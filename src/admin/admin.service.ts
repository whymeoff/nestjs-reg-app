import { Injectable, NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
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
import { getConnection } from 'typeorm';
import { Role } from 'src/roles/role.entity';
import { RoleRepository } from 'src/roles/role.repository';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(ParticipantRepository)
    private participantRepository: ParticipantRepository,
    private jwtService: JwtService,
    @InjectRepository(RoleRepository)
    private roleRepository: RoleRepository
  ) {}

  async checkRole(roleId: number, action: string) {
    const role = await this.roleRepository.findOne({ id: roleId })
    const { priveleges } = role
    
    for (let i = 0; i < priveleges.length; i++) {
      if (priveleges[i].name === action) return
    }

    throw new ForbiddenException('You have not enough rights for this action')
  }

  async loginUser(userAuthDto: UserAuthDto) {
    const { email, password } = userAuthDto
    const user = await this.userRepository.findOne({ email })

    if (user && await bcrypt.compare(password, user.password)) {
      const payload: JwtPayload = { email }
      const token = this.jwtService.sign(payload)
      return { token }
    } else {
      throw new UnauthorizedException('Invalid credentials')
    }
  }

  async createUser(userDto: UserDto, req): Promise<User> {
    await this.checkRole(parseInt(req.user.role), 'CreateUser')
    return await this.userRepository.createOne(userDto)
  }

  async updateUser(id: number, userDto: UserDto, req): Promise<User> {
    await this.checkRole(parseInt(req.user.role), 'PatchUser')
    return this.userRepository.updateOne(id, userDto)
  }

  async getUser(id: number, req): Promise<User> {
    await this.checkRole(parseInt(req.user.role), 'GetUser')

    const user = await this.userRepository.findOne({ id })

    if (!user) {
      throw new NotFoundException(`Cant find user by ID ${id}`)
    }

    delete user.password

    return user
  }

  async getUsers(req): Promise<User[]> {
    await this.checkRole(parseInt(req.user.role), 'GetUsers')

    const users = await this.userRepository.find()

    return users
  }

  async deleteUser(id: number, req) {
    await this.checkRole(parseInt(req.user.role), 'DeleteUser')

    const user = await this.userRepository.findOne({ id })

    if (!user) {
      throw new NotFoundException(`Cant find and delete user by ID ${id}`)
    }

    await this.userRepository.remove(user)

    return { message: 'User deleted successfuly' }
  }

  async getParticipant(id: number, req): Promise<Participant> {
    await this.checkRole(parseInt(req.user.role), 'GetParticipant')

    const participant = await this.participantRepository.findOne({ id })

    if (!participant) {
      throw new NotFoundException(`Cant find participant with ID ${id}`)
    }

    return participant
  }

  async getParticipants(participantSearchFilterDto: ParticipantSearchFilterDto, req): Promise<Participant[]> {
    await this.checkRole(parseInt(req.user.role), 'GetParticipants')

    return this.participantRepository.findMany(participantSearchFilterDto)
  }

  async updateParticipant(id: number, participantDto: ParticipantDto, req): Promise<Participant> {
    await this.checkRole(parseInt(req.user.role), 'PatchParticipant')

    return await this.participantRepository.updateOne(id, participantDto)
  }
}
