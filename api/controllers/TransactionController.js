/**
 * TransactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function (req, res) {
    try {
      const { amount, type, description, evidence, category, wallet } = req.allParams();

      if (!amount || !type || !wallet) {
        return res.badRequest({ message: 'Missing fields' });
      }

      // Upadate wallet balance
      const walletToUpdate = await Wallet.findOne({ id: wallet });

      if (!walletToUpdate) {
        return res.badRequest({ message: 'Wallet not found' });
      }

      if (type === 'expense') {
        if (walletToUpdate.balance < amount) {
          return res.badRequest({ message: 'Insufficient funds' });
        }

        const walletUpdated = await Wallet.updateOne({ id: wallet }).set({ balance: walletToUpdate.balance - amount });
        if (!walletUpdated) {
          return res.badRequest({ message: 'Failed to update wallet balance' });
        }
      }

      if (type === 'income') {
        const walletUpdated = await Wallet.updateOne({ id: wallet }).set({ balance: walletToUpdate.balance + amount });
        if (!walletUpdated) {
          return res.badRequest({ message: 'Failed to update wallet balanc' });
        }
      }

      const transaction = await Transaction.create({
        amount,
        type,
        date : new Date().toISOString(),
        description,
        evidence,
        category,
        wallet,
      }).fetch();

      return res.ok({transaction});
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        error,
      });
    }
  },

};

