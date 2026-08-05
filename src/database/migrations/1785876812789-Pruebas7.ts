import { MigrationInterface, QueryRunner } from "typeorm";

export class Pruebas71785876812789 implements MigrationInterface {
    name = 'Pruebas71785876812789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."planes_estado_enum" AS ENUM('Activo', 'Inactivo')`);
        await queryRunner.query(`CREATE TABLE "planes" ("id" SERIAL NOT NULL, "nombre" character varying NOT NULL, "ancho_banda" character varying, "precio_mensual" numeric(10,2) NOT NULL, "descripcion" character varying, "estado" "public"."planes_estado_enum" NOT NULL DEFAULT 'Activo', CONSTRAINT "UQ_9c7630423cf4b1fdb05f4cfb4ef" UNIQUE ("nombre"), CONSTRAINT "PK_91be19f449ba03767fe51acdebc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "clientes" DROP COLUMN "precio_mensual"`);
        await queryRunner.query(`ALTER TABLE "clientes" ADD "whatsapp" character varying`);
        await queryRunner.query(`ALTER TABLE "clientes" ADD "plan_id" integer`);
        await queryRunner.query(`ALTER TABLE "clientes" ADD CONSTRAINT "FK_47396a3e1b64e17eac7c6f3033d" FOREIGN KEY ("plan_id") REFERENCES "planes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clientes" DROP CONSTRAINT "FK_47396a3e1b64e17eac7c6f3033d"`);
        await queryRunner.query(`ALTER TABLE "clientes" DROP COLUMN "plan_id"`);
        await queryRunner.query(`ALTER TABLE "clientes" DROP COLUMN "whatsapp"`);
        await queryRunner.query(`ALTER TABLE "clientes" ADD "precio_mensual" numeric(10,2)`);
        await queryRunner.query(`DROP TABLE "planes"`);
        await queryRunner.query(`DROP TYPE "public"."planes_estado_enum"`);
    }

}
