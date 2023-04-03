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

      let result = new Array();
      transactions.map((transaction, index, array) => {
        const date = new Date(transaction.date).toLocaleDateString();
        const { amount, type } = transaction;

        if (index === 0) {
          result.push({
            date,
            income: type === 'income' ? amount : 0,
            expense: type === 'expense' ? amount : 0,
          });
          return;
        }

        const previousTransaction = array[index - 1];
        const previousDate = new Date(previousTransaction.date).toLocaleDateString();

        if (date === previousDate) {
          if (type === 'income') {
            result[result.length - 1].income += amount;
          }

          if (type === 'expense') {
            result[result.length - 1].expense += amount;
          }
        }

        if (date !== previousDate) {
          result.push({
            date,
            income: type === 'income' ? amount : 0,
            expense: type === 'expense' ? amount : 0,
          });
        }

        return;
      });

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

