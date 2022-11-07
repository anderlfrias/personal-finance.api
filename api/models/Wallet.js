/**
 * Wallet.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    name: {
      type: 'string',
      required: true,
      unique: true,
    },
    amount: {
      type: 'number',
      defaultsTo: 0.0,
      required: true,
    },
    description: {
      type: 'string',
      required: false,
    },
    user: {
      model: 'user',
      required: true,
    },
  },

};

