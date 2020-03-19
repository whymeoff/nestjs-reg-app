import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Privelege } from "./privelege.entity";

@Entity()
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @ManyToMany(type => Privelege, { eager: true })
    @JoinTable()
    priveleges: Privelege[]
}