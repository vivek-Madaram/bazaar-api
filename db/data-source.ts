import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'database-1.ctme2ae2ge59.us-east-1.rds.amazonaws.com',
  port: 5432,
  username: 'postgres',
  password: 'Masterpiece21!',
  database: 'postgres',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js }'],
  logging: false,
  synchronize: true,
  ssl: {
    rejectUnauthorized: false, // You may want to use this in development, but make it secure in production
  },
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
