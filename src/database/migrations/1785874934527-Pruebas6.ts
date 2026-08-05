import { MigrationInterface, QueryRunner } from "typeorm";

export class Pruebas61785874934527 implements MigrationInterface {
    name = 'Pruebas61785874934527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "marcas" ("id" SERIAL NOT NULL, "nombre" character varying NOT NULL, CONSTRAINT "UQ_29f5713899c32a96a8900143c6f" UNIQUE ("nombre"), CONSTRAINT "PK_0dabf9ed9a15bfb634cb675f7d4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tipos_equipo" ("id" SERIAL NOT NULL, "nombre" character varying NOT NULL, "descripcion" character varying, CONSTRAINT "UQ_b7404efd7f1dc54f8aea251a866" UNIQUE ("nombre"), CONSTRAINT "PK_23dc3af473001da87748d7a7410" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."equipos_estado_enum" AS ENUM('Instalado', 'Disponible', 'En mantenimiento', 'Dañado', 'Retirado')`);
        await queryRunner.query(`CREATE TABLE "equipos" ("id" SERIAL NOT NULL, "codigo" character varying NOT NULL, "modelo" character varying, "nro_serie" character varying, "mac" character varying, "ip" character varying, "pppoe_usuario" character varying, "pppoe_password" character varying, "estado" "public"."equipos_estado_enum" NOT NULL DEFAULT 'Disponible', "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "tipo_equipo_id" integer, "marca_id" integer, "cliente_id" integer, CONSTRAINT "UQ_0aadb68488abcce7e277059d78d" UNIQUE ("codigo"), CONSTRAINT "UQ_669ebc06e42faf607fb52993949" UNIQUE ("nro_serie"), CONSTRAINT "PK_451fffd8d175b5b7aadbf5ba760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "instalaciones" ("id" SERIAL NOT NULL, "fecha_instalacion" date, "direccion" character varying, "observaciones" text, "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "cliente_id" integer, "equipo_id" integer, "zona_id" integer, "tecnico_id" integer, CONSTRAINT "PK_e454ca7a565610f53a2863aa9ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."pagos_metodo_pago_enum" AS ENUM('Efectivo', 'Código QR')`);
        await queryRunner.query(`CREATE TABLE "pagos" ("id" SERIAL NOT NULL, "nro_recibo" character varying NOT NULL, "fecha_pago" date NOT NULL, "meses_pagados" integer NOT NULL DEFAULT '1', "monto" numeric(10,2) NOT NULL, "metodo_pago" "public"."pagos_metodo_pago_enum", "vencimiento_anterior" date, "nuevo_vencimiento" date, "notas" character varying, "creado_en" TIMESTAMP NOT NULL DEFAULT now(), "cliente_id" integer, "usuario_id" integer, CONSTRAINT "UQ_25125cc992d82ed83336615b176" UNIQUE ("nro_recibo"), CONSTRAINT "PK_37321ca70a2ed50885dc205beb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "equipos" ADD CONSTRAINT "FK_aa5da9dadab5bbadb88e8e3c734" FOREIGN KEY ("tipo_equipo_id") REFERENCES "tipos_equipo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipos" ADD CONSTRAINT "FK_92381c4538bd2da3017d5567944" FOREIGN KEY ("marca_id") REFERENCES "marcas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipos" ADD CONSTRAINT "FK_2872439dfcad82f8968945960a5" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "instalaciones" ADD CONSTRAINT "FK_af834e09d2fd394c2805262b964" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "instalaciones" ADD CONSTRAINT "FK_f36392d2449df5230957d80eb73" FOREIGN KEY ("equipo_id") REFERENCES "equipos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "instalaciones" ADD CONSTRAINT "FK_3850a0623b5c7743f9cf4b75a84" FOREIGN KEY ("zona_id") REFERENCES "zonas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "instalaciones" ADD CONSTRAINT "FK_b702e38018e04f176382abb99fc" FOREIGN KEY ("tecnico_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pagos" ADD CONSTRAINT "FK_3fa5cbaf018b1004741ff1afca5" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pagos" ADD CONSTRAINT "FK_fec62c47394f5abc6ab3e9159cb" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pagos" DROP CONSTRAINT "FK_fec62c47394f5abc6ab3e9159cb"`);
        await queryRunner.query(`ALTER TABLE "pagos" DROP CONSTRAINT "FK_3fa5cbaf018b1004741ff1afca5"`);
        await queryRunner.query(`ALTER TABLE "instalaciones" DROP CONSTRAINT "FK_b702e38018e04f176382abb99fc"`);
        await queryRunner.query(`ALTER TABLE "instalaciones" DROP CONSTRAINT "FK_3850a0623b5c7743f9cf4b75a84"`);
        await queryRunner.query(`ALTER TABLE "instalaciones" DROP CONSTRAINT "FK_f36392d2449df5230957d80eb73"`);
        await queryRunner.query(`ALTER TABLE "instalaciones" DROP CONSTRAINT "FK_af834e09d2fd394c2805262b964"`);
        await queryRunner.query(`ALTER TABLE "equipos" DROP CONSTRAINT "FK_2872439dfcad82f8968945960a5"`);
        await queryRunner.query(`ALTER TABLE "equipos" DROP CONSTRAINT "FK_92381c4538bd2da3017d5567944"`);
        await queryRunner.query(`ALTER TABLE "equipos" DROP CONSTRAINT "FK_aa5da9dadab5bbadb88e8e3c734"`);
        await queryRunner.query(`DROP TABLE "pagos"`);
        await queryRunner.query(`DROP TYPE "public"."pagos_metodo_pago_enum"`);
        await queryRunner.query(`DROP TABLE "instalaciones"`);
        await queryRunner.query(`DROP TABLE "equipos"`);
        await queryRunner.query(`DROP TYPE "public"."equipos_estado_enum"`);
        await queryRunner.query(`DROP TABLE "tipos_equipo"`);
        await queryRunner.query(`DROP TABLE "marcas"`);
    }

}
