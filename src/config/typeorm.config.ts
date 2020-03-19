import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { User } from 'src/admin/entities/user.entity'
import { Participant } from 'src/participant/entities/participant.entity'
import { Role } from 'src/roles/role.entity'
import { Privelege } from 'src/roles/privelege.entity'

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'regapp',
    entities: [User, Participant, Role, Privelege],
    migrations: ["../migration/**/*.ts"],
    cli: {
        migrationsDir: "../migration"
    },
    synchronize: true
}