'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('ReviewImages', [
      {
      reviewId: 1,
      url: 'https://ap.rdcpix.com/b712a2d26a057e50b25f03f4c3ec55efl-m3657475885od-w1024_h768_x2.webp',
    },
    {
      reviewId: 2,
      url: 'https://ap.rdcpix.com/4c2590416663c39f4b282e6a0a412b4al-m871237782od-w1024_h768_x2.webp',
    },
    {
      reviewId: 3,
      url: 'https://p.rdcpix.com/v02/lbb8c1743-m0od-w1024_h768_x2.webp',
    },
  ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('ReviewImages', [
      {
        reviewId: 1,
        url: 'https://ap.rdcpix.com/b712a2d26a057e50b25f03f4c3ec55efl-m3657475885od-w1024_h768_x2.webp',
      },
      {
        reviewId: 2,
        url: 'https://ap.rdcpix.com/4c2590416663c39f4b282e6a0a412b4al-m871237782od-w1024_h768_x2.webp',
      },
      {
        reviewId: 3,
        url: 'https://p.rdcpix.com/v02/lbb8c1743-m0od-w1024_h768_x2.webp',
      },
    ]);
  }
};
