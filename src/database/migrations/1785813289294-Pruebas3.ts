import { MigrationInterface, QueryRunner } from "typeorm";

export class Pruebas31785813289294 implements MigrationInterface {
    name = 'Pruebas31785813289294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."usuario_rol_enum" AS ENUM('Administrador', 'Tecnico', 'Operador')`);
        await queryRunner.query(`CREATE TYPE "public"."usuario_estado_enum" AS ENUM('Activo', 'Inactivo')`);
        await queryRunner.query(`CREATE TABLE "usuario" ("id" SERIAL NOT NULL, "nombre_completo" character varying, "usuario" character varying NOT NULL, "password_hash" character varying NOT NULL, "email" character varying, "rol" "public"."usuario_rol_enum", "estado" "public"."usuario_estado_enum" NOT NULL DEFAULT 'Activo', CONSTRAINT "UQ_9921cd8ed63a072b8f93ead80f0" UNIQUE ("usuario"), CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "usuario"`);
        await queryRunner.query(`DROP TYPE "public"."usuario_estado_enum"`);
        await queryRunner.query(`DROP TYPE "public"."usuario_rol_enum"`);
    }

}
