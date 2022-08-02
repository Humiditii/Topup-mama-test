import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    book_id:number

    @Column()
    ip_address:string

    @Column({type:'varchar', length:500})
    comment:string

    @Column({type:'timestamp', default: new Date() })
    created_at:Date
}
