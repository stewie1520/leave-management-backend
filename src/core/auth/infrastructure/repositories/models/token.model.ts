import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('token')
export class TokenModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  accountId: string;

  @Column()
  value: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  updateDateCreation() {
    this.createdAt ??= new Date();
    this.updatedAt ??= new Date();
  }

  @BeforeUpdate()
  updateDateUpdate() {
    this.updatedAt = new Date();
  }

  constructor(
    copy: Omit<
      TokenModel,
      'createdAt' | 'updatedAt' | 'updateDateCreation' | 'updateDateUpdate'
    >,
  ) {
    Object.assign(this, copy);
  }
}
