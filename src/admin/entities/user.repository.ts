import { Repository, EntityRepository } from "typeorm"
import { User } from "./user.entity"
import { UserDto } from "../dto/user.dto"
import * as bcrypt from 'bcryptjs'
import { NotFoundException, ConflictException, InternalServerErrorException } from "@nestjs/common"

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    private async fillObject(object: User, userDto: UserDto) {
        for (let key in userDto) {
            if (key === 'password') {
                object[key] = await bcrypt.hash(userDto[key], 8)
            } else {
                object[key] = userDto[key]
            }
        }
    }
    
    async createOne(userDto: UserDto): Promise<User> {
        const user = new User()

        await this.fillObject(user, userDto)
        try {
            await user.save()
        } catch (e) {
            if (e.code === '23505') {
                throw new ConflictException('Email already exists')
            } else {
                throw new InternalServerErrorException()
            }
        }

        return user
    }

    async updateOne(id: number, userDto: UserDto): Promise<User> {
        const user = await this.findOne({ id })

        if (!user) {
            throw new NotFoundException(`Cant find user with ID ${id}`)
        }

        this.fillObject(user, userDto)
        try {
            await user.save()
        } catch (e) {
            if (e.code === '23505') {
                throw new ConflictException('Email already exists')
            } else {
                throw new InternalServerErrorException()
            }
        }

        return user
    }
}