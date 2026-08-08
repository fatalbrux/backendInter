import { MigrationInterface, QueryRunner } from "typeorm";

export class Pruebas101786128354672 implements MigrationInterface {
    name = 'Pruebas101786128354672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clientes" ADD "usuario" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."pagos_banco_enum" AS ENUM('Banco Unión', 'Banco BNB', 'Banco Prodem', 'Tigo Money')`);
        await queryRunner.query(`ALTER TABLE "pagos" ADD "banco" "public"."pagos_banco_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pagos" DROP COLUMN "banco"`);
        await queryRunner.query(`DROP TYPE "public"."pagos_banco_enum"`);
        await queryRunner.query(`ALTER TABLE "clientes" DROP COLUMN "usuario"`);
    }

}
