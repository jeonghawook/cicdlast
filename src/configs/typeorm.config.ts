import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Reviews } from 'src/reviews/reviews.entity';
import { Stores } from 'src/stores/stores.entity';
import { Tables } from 'src/tables/tables.entity';
import { Users } from 'src/users/users.entity';
import { Waitings } from 'src/waitings/waitings.entity';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '8785',
  database: '22-project',
  entities: [Stores, Users, Reviews, Waitings, Tables],
  synchronize: true
}