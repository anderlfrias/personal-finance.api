/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    name: {
      type: 'string',
      required: true
    },
    firstSurname: {
      type: 'string',
      required: true
    },
    secondSurname: {
      type: 'string',
    },
    email: {
      type: 'string',
      required: true,
      unique: true,
    },
    username: {
      type: 'string',
      required: true,
      unique: true,
    },
    password: {
      type: 'string',
      required: true,
    },
    role: {
      type: 'string',
      isIn: ['admin', 'user'],
      defaultsTo: 'user',
    },
    profilePic: {
      type: 'string',
    },
    isActive: {
      type: 'boolean',
      defaultsTo: false,
    },
    wallets: {
      collection: 'wallet',
      via: 'user'
    },
    deleted: {
      type: 'boolean',
      defaultsTo: false,
    },
  },

};

