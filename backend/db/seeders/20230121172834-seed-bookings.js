'use strict';

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
    await queryInterface.bulkInsert('Bookings', [
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
    await queryInterface.bulkDelete('Bookings', [
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
