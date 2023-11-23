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
      const { amount, type, description, date, evidence, category, wallet, budget, user } = req.body;

      if (!type) {
        return res.badRequest({ message: 'Type not provided', messageCode: 'type_not_provided' });
      }

      if (type === 'transfer') {
        const { sourceWallet:sourceWalletId, targetWallet:targetWalletId } = req.body;
        if (!sourceWalletId || !targetWalletId || !user || !amount || !date ) {
          return res.badRequest({ message: 'Missing fields', messageCode: 'missing_fields' });
        }

        const sourceWallet = await Wallet.findOne({ id: sourceWalletId });
        const targetWallet = await Wallet.findOne({ id: targetWalletId });

        if (!sourceWallet || !targetWallet) {
          return res.badRequest({ message: 'Wallet not found' });
        }

        if (sourceWallet.balance < amount) {
          return res.badRequest({ message: 'Insufficient balance', messageCode: 'insufficient_funds' });
        }

        const updatedSourceWallet = await Wallet.updateOne({ id: sourceWalletId }).set({ balance: sourceWallet.balance - amount });
        if (!updatedSourceWallet) {
          return res.badRequest({ message: 'Failed to update source wallet balance' });
        }

        const updatedTargetWallet = await Wallet.updateOne({ id: targetWalletId }).set({ balance: targetWallet.balance + amount });
        if (!updatedTargetWallet) {
          return res.badRequest({ message: 'Failed to update target wallet balance' });
        }

        const transaction = await Transaction.create({
          amount,
          type,
          date,
          description,
          evidence,
          sourceWallet: sourceWalletId,
          targetWallet: targetWalletId,
          category: null,
          wallet: null,
          budget: null,
          user
        }).fetch();

        if (!transaction) {
          return res.badRequest({ message: 'Failed to create transaction' });
        }

        return res.ok({ transaction });
      }

      if (!user || !amount || !date || !wallet ) {
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
        wallet,
        category: category || null,
        budget: budget || null,
        targetWallet: null,
        sourceWallet: null,
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
      const { description, evidence, category, budget } = req.allParams();

      if (!id) {
        return res.badRequest({ message: 'Id not provided' });
      }

      const transactionUpdated = await Transaction.updateOne({ id }).set({
        description,
        evidence,
        category: category || null,
        budget: budget || null
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
      const walletToUpdate = await Wallet.findOne({ id: transactionToDelete.wallet });

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
      const { q, startDate, endDate, categories = '', wallets = '', top, skip } = req.query;

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
        or: [
          {wallet: { in: wallets.split(',')}},
          {sourceWallet: { in: wallets.split(',')}},
          {targetWallet: { in: wallets.split(',')}},
        ],
        date: dateRange,
        description : { contains: q || '', },
      };

      !where.date && delete where.date;
      !where.category.in[0] && delete where.category;
      !where.or[0].wallet.in[0] && delete where.or[0].wallet;
      !where.or[1].sourceWallet.in[0] && delete where.or[1].sourceWallet;
      !where.or[2].targetWallet.in[0] && delete where.or[2].targetWallet;

      const total = await Transaction.count()
        .where(where)
        .meta({ makeLikeModifierCaseInsensitive: true });

      const transactions = await Transaction.find()
        .where(where)
        .meta({ makeLikeModifierCaseInsensitive: true })
        .populate('category')
        .populate('wallet')
        .sort('date DESC')
        .select(['id', 'amount', 'type', 'date', 'description', 'category', 'wallet'])
        .limit(top)
        .skip(skip);

      if (!transactions) {
        return res.badRequest({ message: 'Failed to get transactions' });
      }

      return res.ok({ transactions, total });
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

      const transaction = await Transaction.findOne({ id })
        .populate('category')
        .populate('wallet')
        .populate('budget')
        .populate('targetWallet')
        .populate('sourceWallet');

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
  getByWalletId: async function (req, res) {
    try {
      const { id:walletId } = req.params;

      if (!walletId) {
        return res.badRequest({ message: 'Wallet id not provided' });
      }

      const transactions = await Transaction.find()
        .where({ wallet: walletId })
        .sort('date DESC')
        .select(['id', 'amount', 'type', 'date', 'description', 'category', 'wallet']);

      if (!transactions) {
        return res.badRequest({ message: 'Failed to get transactions' });
      }

      return res.ok({ transactions });
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        messageCode: 'server_error',
        error,
      });
    }
  },
  getByCategoryId: async function (req, res) {
    try {
      const { id:categoryId } = req.params;

      if (!categoryId) {
        return res.badRequest({ message: 'Category id not provided' });
      }

      const transactions = await Transaction.find()
        .where({ category: categoryId })
        .sort('date DESC')
        .select(['id', 'amount', 'type', 'date', 'description', 'category', 'wallet']);

      if (!transactions) {
        return res.badRequest({ message: 'Failed to get transactions' });
      }

      return res.ok({ transactions });
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        messageCode: 'server_error',
        error,
      });
    }
  },
  deleteByCategory: async function (req, res) {
    try {
      const { id:categoryId } = req.params;

      if (!categoryId) {
        return res.badRequest({ message: 'Category id not provided' });
      }

      const category = await Category.findOne({ id: categoryId });
      if (!category) {
        return res.badRequest({ message: 'Category not found' });
      }

      const transactions = await Transaction.find({ category: categoryId });
      if (!transactions) {
        return res.badRequest({ message: 'Transactions not found' });
      }

      const transactionsDeleted = await Transaction.destroy({ category: categoryId }).fetch();
      if (!transactionsDeleted) {
        return res.badRequest({ message: 'Failed to delete transactions' });
      }

      return res.ok({ transactions: transactionsDeleted });
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        messageCode: 'server_error',
        error,
      });
    }
  }

};

