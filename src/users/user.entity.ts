import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
// Not needed anymore because of the custom interceptor to shape outgoing data
//import { Exclude } from 'class-transformer';
import { Report } from '../reports/report.entity';

// Leave off type of the class, so not UserEntity, by community convention only
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;
  @Column()
  // Not needed anymore because of the custom interceptor to shape outgoing data
  //@Exclude()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }
  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }
  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id);
  }
}
