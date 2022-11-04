/**
 * Transaction.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    amount: {
      type: 'number',
      required: true,
    },
    wallet: {
      model: 'wallet',
      required: true,
    },
    categories: {
      collection: 'category',
      via: 'transactions'
    },
    type: {
      type: 'string',
      isIn: ['income', 'expense'],
      required: true,
    },
    date: {
      type: 'string',
      required: true,
    },
    evidence: {
      collection: 'image',
      via: 'transactions',
      required: false,
    },
    user: {
      model: 'user',
      required: true,
    },
    description: {
      type: 'string',
      required: false,
    }
  },

};

