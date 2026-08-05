import { MigrationInterface, QueryRunner } from "typeorm";

export class Pruebas51785873631737 implements MigrationInterface {
    name = 'Pruebas51785873631737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ciudades" ("id" SERIAL NOT NULL, "nombre" character varying NOT NULL, "creado_en" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c945b316bb78e50f777b8ef4ffa" UNIQUE ("nombre"), CONSTRAINT "PK_50ef0e3b41f5e7258dfe73840a3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."zonas_estado_enum" AS ENUM('Activa', 'Inactiva')`);
        await queryRunner.query(`CREATE TABLE "zonas" ("id" SERIAL NOT NULL, "nombre" character varying NOT NULL, "estado" "public"."zonas_estado_enum" NOT NULL DEFAULT 'Activa', "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "ciudad_id" integer, CONSTRAINT "PK_a2af808b9c6ed91c353fd980ab0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."clientes_estado_enum" AS ENUM('Activo', 'Suspendido', 'Corte de servicio')`);
        await queryRunner.query(`CREATE TABLE "clientes" ("id" SERIAL NOT NULL, "codigo" character varying NOT NULL, "nombres" character varying NOT NULL, "apellidos" character varying NOT NULL, "ci" character varying, "telefono" character varying, "email" character varying, "direccion" character varying, "referencia" character varying, "fecha_instalacion" date, "fecha_primer_pago" date, "precio_mensual" numeric(10,2), "estado" "public"."clientes_estado_enum" NOT NULL DEFAULT 'Activo', "proximo_vencimiento" date, "observaciones" text, "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "zona_id" integer, CONSTRAINT "UQ_38777c5bca00ee20f9b57bc4b38" UNIQUE ("codigo"), CONSTRAINT "PK_d76bf3571d906e4e86470482c08" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."usuarios_rol_enum" AS ENUM('Administrador', 'Tecnico', 'Operador')`);
        await queryRunner.query(`CREATE TYPE "public"."usuarios_estado_enum" AS ENUM('Activo', 'Inactivo')`);
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" SERIAL NOT NULL, "nombre_completo" character varying, "usuario" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying, "rol" "public"."usuarios_rol_enum", "estado" "public"."usuarios_estado_enum" NOT NULL DEFAULT 'Activo', "creado_en" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0790a401b9d234fa921e9aa1777" UNIQUE ("usuario"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "zonas" ADD CONSTRAINT "FK_51268b1f4ec837cedb90375837a" FOREIGN KEY ("ciudad_id") REFERENCES "ciudades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clientes" ADD CONSTRAINT "FK_4ffc94ba1a194eab5c864b3e84b" FOREIGN KEY ("zona_id") REFERENCES "zonas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clientes" DROP CONSTRAINT "FK_4ffc94ba1a194eab5c864b3e84b"`);
        await queryRunner.query(`ALTER TABLE "zonas" DROP CONSTRAINT "FK_51268b1f4ec837cedb90375837a"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
        await queryRunner.query(`DROP TYPE "public"."usuarios_estado_enum"`);
        await queryRunner.query(`DROP TYPE "public"."usuarios_rol_enum"`);
        await queryRunner.query(`DROP TABLE "clientes"`);
        await queryRunner.query(`DROP TYPE "public"."clientes_estado_enum"`);
        await queryRunner.query(`DROP TABLE "zonas"`);
        await queryRunner.query(`DROP TYPE "public"."zonas_estado_enum"`);
        await queryRunner.query(`DROP TABLE "ciudades"`);
    }

}
