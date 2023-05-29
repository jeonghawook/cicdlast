import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Reviews } from 'src/reviews/reviews.entity';
import { Stores } from 'src/stores/stores.entity';
import { Tables } from 'src/tables/tables.entity';
import { Users } from 'src/users/users.entity';
import { Waitings } from 'src/waitings/waitings.entity';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'database-1.cyaowhjqxj63.ap-northeast-2.rds.amazonaws.com',
  port: 5432,
  username: 'postgres',
  password: 'gkdnr8785',
  database: '',
  entities: [Stores, Users, Reviews, Waitings, Tables],
  synchronize: true
}   
