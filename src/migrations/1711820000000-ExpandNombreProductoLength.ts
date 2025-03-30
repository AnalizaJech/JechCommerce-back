import { MigrationInterface, QueryRunner } from "typeorm";

export class ExpandNombreProductoLength1711820000000 implements MigrationInterface {
  name = 'ExpandNombreProductoLength1711820000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "producto" ALTER COLUMN "nom_producto" TYPE character varying(1000)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "producto" ALTER COLUMN "nom_producto" TYPE character varying(450)`);
  }
}
