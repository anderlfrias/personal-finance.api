/**
 * StatisticsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const jwtDecode = require('jwt-decode');

module.exports = {
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
        .sort('date DESC')
        .select(['id', 'amount', 'date', 'type']);

      if (!transactions) {
        return res.badRequest({ message: 'Failed to get transactions' });
      }

      // let result = transactions;
      // transactions.map((transaction, index, transactions) => { // Extract amounts
      //   const date = new Date(transaction.date).toLocaleDateString();
      //   const {amount, type} = transaction;

      //   const previousTransaction = transactions[index - 1];
      //   const previousDate = previousTransaction ? new Date(previousTransaction.date).toLocaleDateString() : null;

      //   if (date !== previousDate) {
      //     return;
      //   }

      //   if (type === 'expense') {
      //     result[index - 1] = { ...transaction, amount: previousTransaction.amount + amount };
      //   }

      //   if (type === 'income') {
      //     result[index - 1] = { ...transaction, amount: previousTransaction.amount - amount };
      //   }
      // });

      // const labels = transactions.map((transaction) => { // Extract dates
      //   const date = new Date(transaction.date).toLocaleDateString();
      //   return date;
      // }).filter((value, index, self) => { // Remove duplicates
      //   return self.indexOf(value) === index;
      // });

      // Group transactions by date
      const result = transactions.reduce((acc, transaction) => {
        const date = new Date(transaction.date).toLocaleDateString();
        const { amount, type } = transaction;

        if (!acc[date]) {
          acc[date] = {
            income: 0,
            expense: 0,
          };
        }

        if (type === 'income') {
          acc[date].income += amount;
        }

        if (type === 'expense') {
          acc[date].expense += amount;
        }

        return acc;
      }, {});

      return res.ok( result );
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        messageCode: 'server_error',
        error,
      });
    }
  },
};

