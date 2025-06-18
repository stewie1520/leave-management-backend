import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1750221151676 implements MigrationInterface {
  name = 'Init1750221151676';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "leave_balance" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "totalDays" integer NOT NULL, "usedDays" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3455e264c75148742540634aca2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."employee_role_enum" AS ENUM('STAFF', 'MANAGER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "employee" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "role" "public"."employee_role_enum" NOT NULL DEFAULT 'STAFF', "accountId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "leaveBalanceId" uuid, CONSTRAINT "REL_7ca4bbefd0d33490f569912720" UNIQUE ("leaveBalanceId"), CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."leave_request_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "leave_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "employeeId" uuid NOT NULL, "startDate" date NOT NULL, "endDate" date NOT NULL, "reason" character varying NOT NULL, "status" "public"."leave_request_status_enum" NOT NULL DEFAULT 'PENDING', "reviewerId" uuid, "reviewedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6f6ed3822203a4e10a5753368db" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accountId" uuid NOT NULL, "value" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD CONSTRAINT "FK_7ca4bbefd0d33490f5699127207" FOREIGN KEY ("leaveBalanceId") REFERENCES "leave_balance"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "leave_request" ADD CONSTRAINT "FK_03889549dbbc56e2a9f5ce107a0" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "leave_request" ADD CONSTRAINT "FK_fb29fa6765b855d22b8942b6705" FOREIGN KEY ("reviewerId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "leave_request" DROP CONSTRAINT "FK_fb29fa6765b855d22b8942b6705"`,
    );
    await queryRunner.query(
      `ALTER TABLE "leave_request" DROP CONSTRAINT "FK_03889549dbbc56e2a9f5ce107a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" DROP CONSTRAINT "FK_7ca4bbefd0d33490f5699127207"`,
    );
    await queryRunner.query(`DROP TABLE "account"`);
    await queryRunner.query(`DROP TABLE "token"`);
    await queryRunner.query(`DROP TABLE "leave_request"`);
    await queryRunner.query(`DROP TYPE "public"."leave_request_status_enum"`);
    await queryRunner.query(`DROP TABLE "employee"`);
    await queryRunner.query(`DROP TYPE "public"."employee_role_enum"`);
    await queryRunner.query(`DROP TABLE "leave_balance"`);
  }
}
