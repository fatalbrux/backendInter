import { DataSource } from "typeorm";

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgresql',
    database: 'bd_internet',
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/database/migrations/*.ts']
});