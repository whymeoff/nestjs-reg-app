import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, Unique, OneToOne, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import { Country } from "src/countries/country.entity";

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

    @ManyToOne(type => Country, { eager: true })
    @JoinColumn()
    country: Country

    @Column()
    status: string

    @Column()
    accountStatus: string
}