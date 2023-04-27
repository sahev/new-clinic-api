import { MigrationInterface, QueryRunner } from 'typeorm';

export class headquarterCol1682629037502 implements MigrationInterface {
  name = 'headquarterCol1682629037502';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`clinics\` ADD \`headQuarterId\` int NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`clinics\` DROP COLUMN \`headQuarterId\``,
    );
  }
}
