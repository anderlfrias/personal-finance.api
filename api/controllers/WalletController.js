/**
 * WalletController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const jwtDecode = require('jwt-decode');
module.exports = {
  create: async (req, res) => {
    try {
      const { name, balance, description, user } = req.body;

      if (!name || !balance || !user) {
        return res.badRequest({ message: 'Missing fields', messageCode: 'missing_fields' });
      }

      const wallet = await Wallet.create({ name, balance, description, user, }).fetch();
      res.ok({wallet});
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        messageCode: 'server_error',
        error,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, balance, description } = req.body;

      if (!id) {
        return res.badRequest({ message: 'Missing fields' });
      }

      const wallet = await Wallet.updateOne({ id }).set({ name, balance, description });
      res.ok({
        message: 'Wallet updated',
        wallet,
      });
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        messageCode: 'server_error',
        error,
      });
    }
  },

  delete: async (req, res) => {
    try{
      const { id } = req.params;

      if (!id) {
        return res.badRequest({ message: 'Missing fields' });
      }

      const walletDeleted = await Wallet.destroyOne({ id });

      if (walletDeleted) {
        return res.ok({ message: 'Wallet deleted', wallet: walletDeleted });
      }

      return res.badRequest({ message: 'Error deleting wallet' });

    } catch (error) {
      return res.serverError({
        message: 'Server error',
        messageCode: 'server_error',
        error,
      });
    }
  },

  get: async (req, res) => {
    try {
      const { q = '' } = req.allParams();
      const {authorization : token } = req.headers;

      if (!token) {
        return res.badRequest({ message: 'Token not provided' });
      }

      const user = jwtDecode(token);

      const wallets = await Wallet.find()
        .where({
          user: user.id,
          name: { contains: q },
        }).meta({makeLikeModifierCaseInsensitive: true});

      res.ok(wallets);
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        messageCode: 'server_error',
        error,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const {authorization : token } = req.headers;

      if (!token) {
        return res.badRequest({ message: 'Token not provided' });
      }

      const user = jwtDecode(token);

      if (!id) {
        return res.badRequest({ message: 'Missing fields' });
      }

      const wallet = await Wallet.findOne({ id, user: user.id });

      if (wallet) {
        return res.ok( wallet );
      }

      return res.badRequest({ message: 'Error getting wallet' });
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        messageCode: 'server_error',
        error,
      });
    }
  }
};

