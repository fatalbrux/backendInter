import { MigrationInterface, QueryRunner } from "typeorm";

export class Pruebacomimg1788635914438 implements MigrationInterface {
    name = 'Pruebacomimg1788635914438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pagos" ADD "comprobante_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pagos" DROP COLUMN "comprobante_url"`);
    }

}
