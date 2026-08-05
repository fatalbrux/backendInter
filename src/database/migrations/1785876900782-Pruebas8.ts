import { MigrationInterface, QueryRunner } from "typeorm";

export class Pruebas81785876900782 implements MigrationInterface {
    name = 'Pruebas81785876900782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clientes" DROP COLUMN "whatsapp"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clientes" ADD "whatsapp" character varying`);
    }

}
