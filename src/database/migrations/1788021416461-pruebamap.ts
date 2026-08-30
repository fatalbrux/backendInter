import { MigrationInterface, QueryRunner } from "typeorm";

export class Pruebamap1788021416461 implements MigrationInterface {
    name = 'Pruebamap1788021416461'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clientes" ADD "latitud" double precision`);
        await queryRunner.query(`ALTER TABLE "clientes" ADD "longitud" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clientes" DROP COLUMN "longitud"`);
        await queryRunner.query(`ALTER TABLE "clientes" DROP COLUMN "latitud"`);
    }

}
