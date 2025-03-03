import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class Usuario {
    @PrimaryColumn()
    username: string;

    @Column()
    password: string;

    @Column()
    rol: string; // 'ADMIN', 'PROFESOR', 'ESTUDIANTE'

    @Column({ nullable: true })
    referenciaId: string; // ID del profesor o estudiante asociado

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
} 