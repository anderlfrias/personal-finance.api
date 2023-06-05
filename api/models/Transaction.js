/**
 * Transaction.js
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

    amount: {
      type: 'number',
      defaultsTo: 0.0,
    },
    type: {
      type: 'string',
      isIn: ['income', 'expense', 'transfer'],
      required: true,
    },
    date: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: false,
    },
    evidence: {
      type: 'json',
      columnType: 'array',
      required: false,
    },
    category: {
      model: 'category',
    },
    wallet: {
      model: 'wallet',
      required: false,
    },
    sourceWallet: {
      model: 'wallet',
      required: false,
    },
    targetWallet: {
      model: 'wallet',
      required: false,
    },
    user: {
      model: 'user',
      required: true,
    },
    budget: {
      model: 'budget',
      required: false
    },
  },

};

