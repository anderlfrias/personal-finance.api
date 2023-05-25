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
      const { name, description, user } = req.body;

      if (!name || !user) {
        return res.badRequest({ message: 'Missing fields', messageCode: 'missing_fields' });
      }

      const wallet = await Wallet.create({ name, description, user, }).fetch();
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
      const { name, description } = req.body;

      if (!id) {
        return res.badRequest({ message: 'Missing fields' });
      }

      const wallet = await Wallet.updateOne({ id }).set({ name, description });
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
  },

  getTotalBalance: async (req, res) => {
    try {
      const {authorization : token } = req.headers;

      if (!token) {
        return res.badRequest({ message: 'Token not provided' });
      }

      const user = jwtDecode(token);

      const wallets = await Wallet.find().where({ user: user.id });

      const totalBalance = wallets.reduce((acc, wallet) => {
        return acc + wallet.balance;
      }, 0);

      if (totalBalance){
        return res.ok( totalBalance );
      }

      return res.badRequest({ message: 'Error', messageCode: 'error'});
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        messageCode: 'server_error',
        error,
      });
    }
  },

  trasnferBalance: async (req, res) => {
    try {
      const { sourceWalletId, targetWalletId, amount } = req.body;
      const {authorization : token } = req.headers;

      if (!token) {
        return res.badRequest({ message: 'Token not provided' });
      }

      const user = jwtDecode(token);

      if (!sourceWalletId || !targetWalletId || !amount) {
        return res.badRequest({ message: 'Missing fields' });
      }

      const sourceWallet = await Wallet.findOne({ id: sourceWalletId, user: user.id });
      const targetWallet = await Wallet.findOne({ id: targetWalletId, user: user.id });

      if (!sourceWallet || !targetWallet) {
        return res.badRequest({ message: 'Wallet not found' });
      }

      if (sourceWallet.balance < amount) {
        return res.badRequest({ message: 'Insufficient balance' });
      }

      const updatedSourceWallet = await Wallet.updateOne({ id: sourceWalletId }).set({ balance: sourceWallet.balance - amount });
      const updatedTargetWallet = await Wallet.updateOne({ id: targetWalletId }).set({ balance: targetWallet.balance + amount });

      if (updatedSourceWallet && updatedTargetWallet) {
        return res.ok({ message: 'Balance transfered', sourceWallet: updatedSourceWallet, targetWallet: updatedTargetWallet });
      }

      return res.badRequest({ message: 'Error transfering balance' });
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        messageCode: 'server_error',
        error,
      });
    }
  }
};

