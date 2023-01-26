'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'Bookings';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 2,
        userId: 1,
        startDate: '2023-02-01',
        endDate: '2023-02-05',
      },
      {
        spotId: 1,
        userId: 2,
        startDate: '2023-01-23',
        endDate: '2023-01-28',
      },
      {
        spotId: 4,
        userId: 3,
        startDate: '2023-03-05',
        endDate: '2023-03-15',
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Bookings';
    await queryInterface.bulkDelete(options, [
      {
        spotId: 2,
        userId: 1,
        startDate: '2023-02-01',
        endDate: '2023-02-05',
      },
      {
        spotId: 1,
        userId: 2,
        startDate: '2023-01-23',
        endDate: '2023-01-28',
      },
      {
        spotId: 4,
        userId: 3,
        startDate: '2023-03-05',
        endDate: '2023-03-15',
      },
    ],);
  }
};
