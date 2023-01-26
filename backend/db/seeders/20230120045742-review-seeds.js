'use strict';

const { User, Spots } = require('../models');

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
    options.tableName = 'Reviews'
    await queryInterface.bulkInsert(options, [
      {
        userId: 2,
        spotId: 1,
        review: 'Excellent location! Great pub near by!',
        stars: 5,
      },
      {
        userId: 3,
        spotId: 4,
        review: 'Quiet with lovely nearby views of the Beartooth and Absaroka Mtns.',
        stars: 4,
      },
      {
        userId: 1,
        spotId: 3,
        review: 'Great budget evening stay!',
        stars: 3,
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
    options.tableName = 'Reviews'
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      review: { [Op.in]: ['Excellent location! Great pub near by!', 'Quiet with lovely nearby views of the Beartooth and Absaroka Mtns.', 'Great budget evening stay!']}
    });
  }
};
