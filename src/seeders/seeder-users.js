'use strict';

module.exports = {
  // up: them du lieu vao
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'admin@gmail.com',
        password: '123456',
        firstName: 'John',
        lastName: 'Doe',
        address: 'RUSSIA',
        gender: 1,
        roleId: 'R1',
        phonenumber: '+79219128766',
        positionId: 'doctor',
        image: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  // down: khi muon cancel viec them du lieu, rollback
  down: async () => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
