import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('account')
export class AccountModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

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
      AccountModel,
      'createdAt' | 'updatedAt' | 'updateDateCreation' | 'updateDateUpdate'
    >,
  ) {
    Object.assign(this, copy);
  }
}
