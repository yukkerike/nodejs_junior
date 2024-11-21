const { faker } = require('@faker-js/faker');

class SeedUsersData1700000001000 {
  async up(queryRunner) {
    const batchSize = 10000;
    const totalUsers = 100000;

    console.time('User Seed Migration');

    for (let i = 0; i < totalUsers; i += batchSize) {
      const users = Array.from({ length: batchSize }, () => ({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        age: faker.number.int({ min: 18, max: 80 }),
        gender: faker.person.sex(),
        hasProblems: faker.datatype.boolean(0.3),
        createdAt: new Date(),
      }));

      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('users')
        .values(users)
        .execute();

      console.log(`Seeded ${i + batchSize} users`);
    }

    console.timeEnd('User Seed Migration');
  }

  async down(queryRunner) {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('users')
      .execute();
  }
}

module.exports = { SeedUsersData1700000001000 };
