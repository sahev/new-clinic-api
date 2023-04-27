import { MigrationInterface, QueryRunner } from 'typeorm';

export class logotype1682448598709 implements MigrationInterface {
  name = 'logotype1682448598709';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`clinics\` DROP COLUMN \`logo\``);
    await queryRunner.query(
      `ALTER TABLE \`clinics\` ADD \`logo\` longtext NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`clinics\` DROP COLUMN \`logo\``);
    await queryRunner.query(
      `ALTER TABLE \`clinics\` ADD \`logo\` varchar(255) NOT NULL`,
    );
  }
}
