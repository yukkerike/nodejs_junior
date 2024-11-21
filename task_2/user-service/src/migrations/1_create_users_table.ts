const { MigrationInterface, QueryRunner, Table } = require('typeorm');

class CreateUsersTable1700000000000 {
  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'firstName',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'lastName',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'age',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'gender',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'hasProblems',
            type: 'boolean',
            default: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
        indices: [
          {
            name: 'IDX_USER_PROBLEMS',
            columnNames: ['hasProblems'],
          },
        ],
      }),
      true,
    );
  }

  async down(queryRunner) {
    await queryRunner.dropTable('users');
  }
}

module.exports = { CreateUsersTable1700000000000 };
