/**
 * Role.js
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
    normalizedName: {
      type: 'string',
      required: true,
      unique: true,
    },
    users: {
      collection: 'user',
      via: 'role'
    }
  },

};

