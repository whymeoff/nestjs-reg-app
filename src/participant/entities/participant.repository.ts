import { Repository, EntityRepository } from "typeorm";
import { Participant } from "./participant.entity";
import { ParticipantDto } from "../dto/participant.dto";
import * as bcrypt from 'bcryptjs'
import { ParticipantSearchFilterDto } from "src/admin/dto/participant-search-filter.dto";
import { NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(Participant)
export class ParticipantRepository extends Repository<Participant> {
    private fillObject(object: Participant, participantDto: ParticipantDto) {
        for (let key in participantDto) {
            object[key] = participantDto[key]
        }
    }

    private checkValues(participantDto: ParticipantDto) {
        const availableStatuses = ['new', 'approved', 'declined']
        const availableRoles = ['listener', 'speaker']

        if (!availableRoles.find(el => el === participantDto.role)) {
            throw new BadRequestException('Invalid role value')
        }

        if (participantDto.status) {
            if (!availableStatuses.find(el => el === participantDto.status)) {
                throw new BadRequestException('Invalid status value')
            }
        }
    }
    
    async createOne(participantDto: ParticipantDto): Promise<Participant> {
        this.checkValues(participantDto)
        const participant = new Participant()
        
        this.fillObject(participant, participantDto)
        participant.status = 'new'
        participant.accountStatus = 'not_active'

        try {
            await participant.save()
        } catch (e) {
            if (e.code === '23505') {
                throw new ConflictException('Email already in use')
            } else {
                throw new InternalServerErrorException()
            }
        }

        return participant
    }

    async updateOne(id:number, participantDto: ParticipantDto): Promise<Participant> {
        this.checkValues(participantDto)
        const participant = await this.findOne({ id })

        if (!participant) {
            throw new NotFoundException(`Cant find participant with ID ${id}`)
        }

        this.fillObject(participant, participantDto)
        try {
            await participant.save()
        } catch (e) {
            if (e.code === '23505') {
                throw new ConflictException('Email already in use')
            } else {
                throw new InternalServerErrorException()
            }
        }

        return participant
    }

    async findMany(participantSearchFilterDto: ParticipantSearchFilterDto): Promise<Participant[]> {
        const query = this.createQueryBuilder('participant')
            .innerJoinAndSelect('participant.country', 'country')
        const { sort, skip, status, search } = participantSearchFilterDto

        if (sort) {
            query.orderBy(`participant.${sort}`)
        }

        if (status) {
            query.andWhere(`participant.status = :status`, { status })
        }

        if (search) {
            query.andWhere(`
                participant.firstName LIKE :search OR participant.lastName LIKE :search OR participant.email LIKE :search OR participant.companyName LIKE :search
            `, { search: `%${search}%` })
        }

        query.offset(parseInt(skip) || 0)
        query.limit(10)

        const participants = await query.getMany()

        return participants
    }
}