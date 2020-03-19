import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity()
@Unique(['email'])
export class Participant extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    email: string

    @Column()
    arrivalDate: number //millisecond

    @Column()
    departureDate: number

    @Column()
    companyName: string

    @Column()
    position: string

    @Column()
    role: string

    @Column()
    sex: string

    @Column()
    country: number

    @Column()
    status: string

    @Column()
    accountStatus: string
}