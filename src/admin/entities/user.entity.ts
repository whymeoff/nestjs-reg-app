import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    role: UserRoles
}

export enum UserRoles {
    SUPER_ADMIN = 'SUPER_ADMIN',
    BASIC = 'BASIC'
}