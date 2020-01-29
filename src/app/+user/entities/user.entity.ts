import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * This is a demo entity. Feel free to remove/update it.
 */
@Entity()
export class User {

  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

}
