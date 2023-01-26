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
   options.tableName = 'Spots'
    await queryInterface.bulkInsert(options, [
      {
      ownerId: '1',
      address: '49 Vanderlin Park',
      city: 'Rochester',
      state: 'New York',
      country: 'United States',
      lat: 43.22897,
      lng: -77.54736,
      name: "Lake Breeze Estate",
      description: "20's home in a cozy neighborhood moments from the Great Lakes",
      price: 200,
    },
    {
      ownerId: '1',
      address: '4605 Bowman Drive',
      city: 'Billings',
      state: 'Montana',
      country: 'United States',
      lat: 45.72984,
      lng: -108.52904,
      name: 'The Chicken Cottage',
      description: 'Modest home seated at the mouth of a deep coulee cutting up into the south hills.',
      price: 375,
    },
    {
      ownerId: '2',
      address: '27341 Dartmouth Street',
      city: 'Madison Heights',
      state: 'Michigan',
      country: 'United States',
      lat: 42.4935,
      lng: -83.11165,
      name: 'The Heights Hotel',
      description: 'Pleasant home seated on a concrete pad in a blue collar neighborhood.',
      price: 150,
    },
    {
      ownerId: '3',
      address: '13 Whitetail Drive',
      city: 'Columbus',
      state: 'Montana',
      country: 'United States',
      lat: 45.58022,
      lng: -109.22839,
      name: 'Log Home',
      description: 'Beautiful log home nestled into the woods.',
      price: 350,
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
    options.tableName = 'Spots'
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['49 Vanderlin Park', '4605 Bowman Drive', '27341 Dartmouth Street', '13 Whitetail Drive']}
    });
  }
};
