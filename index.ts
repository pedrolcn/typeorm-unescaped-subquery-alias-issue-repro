import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, getRepository, createConnection } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

async function run() {
  const connection = await createConnection({
    type: 'postgres',
    database: 'test_db',
    username: 'postgres',
    password: 'postgres',
    entities: [User],
  });

  const sqlString = getRepository(User).createQueryBuilder('user')
    .select('user.id', 'id')
    .innerJoin(
      qb =>
        qb
          .select('subUser.name', 'name')
          .addSelect('MAX(subUser.createdAt)', 'createdAt')
          .from(User, 'subUser')
          .groupBy('1'),
      'subUser',
      'user.name = subUser.name AND user.createdAt = subUser.createdAt'
    )
    .getSql();

  console.log(sqlString);
  await connection.close();
}

run();
