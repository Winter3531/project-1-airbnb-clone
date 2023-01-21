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
    await queryInterface.bulkInsert('SpotImages', [
      {
      url: 'https://ap.rdcpix.com/b712a2d26a057e50b25f03f4c3ec55efl-m46367314od-w1024_h768_x2.webp',
      spotId: 1,
      preview: true,
    },
    {
      url: 'https://photos.zillowstatic.com/fp/5b34e9a18482d0828254681c62ec8ab3-uncropped_scaled_within_1536_1152.webp',
      spotId: 2,
      preview: true,
    },
    {
      url: 'https://p.rdcpix.com/v01/lbb8c1743-m1od-w1024_h768_x2.webp',
      spotId: 3,
      preview: true,
    },
    {
      url: 'https://ap.rdcpix.com/4c2590416663c39f4b282e6a0a412b4al-m3885430387od-w1024_h768_x2.webp',
      spotId: 4,
      preview: true,
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
    await queryInterface.bulkDelete('SpotImages', [
      {
      url: 'https://ap.rdcpix.com/b712a2d26a057e50b25f03f4c3ec55efl-m46367314od-w1024_h768_x2.webp',
      spotId: 1,
      preview: true,
    },
    {
      url: 'https://photos.zillowstatic.com/fp/5b34e9a18482d0828254681c62ec8ab3-uncropped_scaled_within_1536_1152.webp',
      spotId: 2,
      preview: true,
    },
    {
      url: 'https://p.rdcpix.com/v01/lbb8c1743-m1od-w1024_h768_x2.webp',
      spotId: 3,
      preview: true,
    },
    {
      url: 'https://ap.rdcpix.com/4c2590416663c39f4b282e6a0a412b4al-m3885430387od-w1024_h768_x2.webp',
      spotId: 4,
      preview: true,
    },
  ]);
  }
};
