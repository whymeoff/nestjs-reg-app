import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtPayload } from './jwt-payload.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from './entities/user.repository'
import { User } from './entities/user.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'Secret'
        })
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { email } = payload
        const user = await this.userRepository.findOne({ email })

        if (!user) {
            throw new UnauthorizedException()
        }
        return user
    }
}