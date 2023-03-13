/**
 * TransactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const jwtDecode = require('jwt-decode');
module.exports = {
  create: async function (req, res) {
    try {
      const { amount, type, description, date, evidence, category, wallet, user } = req.body;

      if (!user || !wallet || !amount || !type ) {
        return res.badRequest({ message: 'Missing fields', messageCode: 'missing_fields' });
      }

      // Upadate wallet balance
      const walletToUpdate = await Wallet.findOne({ id: wallet });

      if (!walletToUpdate) {
        return res.badRequest({ message: 'Wallet not found', messageCode: 'wallet_not_found' });
      }

      if (type === 'expense') {
        if (walletToUpdate.balance < amount) {
          return res.badRequest({ message: 'Insufficient funds', messageCode: 'insufficient_funds' });
        }

        const walletUpdated = await Wallet.updateOne({ id: wallet }).set({ balance: walletToUpdate.balance - amount });
        if (!walletUpdated) {
          return res.badRequest({ message: 'Failed to update wallet balance' });
        }
      }

      if (type === 'income') {
        const walletUpdated = await Wallet.updateOne({ id: wallet }).set({ balance: walletToUpdate.balance + amount });
        if (!walletUpdated) {
          return res.badRequest({ message: 'Failed to update wallet balance' });
        }
      }

      const transaction = await Transaction.create({
        amount,
        type,
        date,
        description,
        evidence,
        category,
        wallet,
        user
      }).fetch();

      if (!transaction) {
        return res.badRequest({ message: 'Failed to create transaction' });
      }

      return res.ok({transaction});
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        messageCode: 'server_error',
        error,
      });
    }
  },
  update: async function (req, res) {
    try {
      const { id } = req.params;
      const { description, evidence } = req.allParams();

      if (!id) {
        return res.badRequest({ message: 'Id not provided' });
      }

      const transactionUpdated = await Transaction.updateOne({ id }).set({
        description,
        evidence,
      });

      if (!transactionUpdated) {
        return res.badRequest({ message: 'Failed to update transaction' });
      }

      return res.ok({ transactionUpdated });
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        messageCode: 'server_error',
        error,
      });
    }
  },
  delete: async function (req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.badRequest({ message: 'Id not provided' });
      }

      const transactionToDelete = await Transaction.findOne({ id });

      if (!transactionToDelete) {
        return res.badRequest({ message: 'Transaction not found' });
      }

      // Upadate wallet balance
      const walletToUpdate = await Wallet.findOne({ wallet: transactionToDelete.wallet });

      if (!walletToUpdate) {
        return res.badRequest({ message: 'Wallet not found' });
      }

      if (transactionToDelete.type === 'expense') {
        const walletUpdated = await Wallet.updateOne({ id: walletToUpdate.id }).set({ balance: walletToUpdate.balance + transactionToDelete.amount });
        if (!walletUpdated) {
          return res.badRequest({ message: 'Failed to update wallet balance' });
        }
      }

      if (transactionToDelete.type === 'income') {
        const walletUpdated = await Wallet.updateOne({ id: walletToUpdate.id }).set({ balance: walletToUpdate.balance - transactionToDelete.amount });
        if (!walletUpdated) {
          return res.badRequest({ message: 'Failed to update wallet balance' });
        }
      }

      const transactionDeleted = await Transaction.destroyOne({ id });

      if (!transactionDeleted) {
        return res.badRequest({ message: 'Failed to delete transaction' });
      }

      return res.ok({ transaction: transactionDeleted });
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        messageCode: 'server_error',
        error,
      });
    }
  },
  get: async function (req, res) {
    try {
      const { authorization : token } = req.headers;
      const { q, startDate, endDate, categories = '', wallets = '' } = req.query;

      if (!token) {
        return res.badRequest({ message: 'Token not provided' });
      }

      const { id } = jwtDecode(token);

      const dateRange = startDate && endDate ? {
        '>=': startDate,
        '<=': endDate,
      } : startDate && !endDate ? {
        '>=': startDate,
      } : !startDate && endDate ? {
        '<=': endDate,
      } : null;

      const where = {
        user: id,
        category : { in : categories.split(',')},
        wallet: { in: wallets.split(',')},
        date: dateRange,
        description : { contains: q || '', },
      };

      !where.date && delete where.date;
      !where.category.in[0] && delete where.category;
      !where.wallet.in[0] && delete where.wallet;

      const transactions = await Transaction.find()
        .where(where)
        .meta({ enableExperimentalDeepTargets: true })
        .populate('category')
        .populate('wallet')
        .sort('date DESC');

      if (!transactions) {
        return res.badRequest({ message: 'Failed to get transactions' });
      }

      return res.ok( transactions );
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        messageCode: 'server_error',
        error,
      });
    }
  },
  getById: async function (req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.badRequest({ message: 'Id not provided' });
      }

      const transaction = await Transaction.findOne({ id });

      if (!transaction) {
        return res.badRequest({ message: 'Transaction not found' });
      }

      return res.ok( transaction );
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        messageCode: 'server_error',
        error,
      });
    }
  },

};

