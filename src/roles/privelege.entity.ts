import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Privelege extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
}