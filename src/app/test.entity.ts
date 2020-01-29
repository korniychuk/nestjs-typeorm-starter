import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TestEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

}
