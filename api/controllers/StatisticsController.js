/**
 * StatisticsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const jwtDecode = require('jwt-decode');

const getStartDateOfYears = (year) => {
  return new Date(year, 0, 1, 0, 0, 0, 0);
};

const getEndDateOfYears = (year) => {
  return new Date(year, 11, 31, 23, 59, 59);
};

const getLastDayOfMonth = (year, month) => {
  const date = new Date(year, month + 1, 0);
  return date.getDate();
};

const getStartDateOfWeeks = (date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const newDate = new Date(date.setDate(diff));
  return new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 0, 0, 0, 0);
};

const getEndDateOfWeeks = (date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) + 6;
  const newDate = new Date(date.setDate(diff));
  return new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 0, 0, 0, 0);
};

const getStartDate = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const getEndDate = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), getLastDayOfMonth(date.getFullYear(), date.getMonth()), 23, 59, 59);
};

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
  getByTimeFrame: async function (req, res) {
    try {
      const { authorization : token } = req.headers;
      const { timeFrame } = req.query;

      if (!token) {
        return res.badRequest({ message: 'Token not provided' });
      }

      const { id } = jwtDecode(token);

      const dateRange = timeFrame === 'week' ? {
        '>=': getStartDateOfWeeks(new Date()).toISOString(),
        '<=': getEndDateOfWeeks(new Date()).toISOString(),
      } : timeFrame === 'month' ? {
        '>=': getStartDate().toISOString(),
        '<=': getEndDate().toISOString(),
      } : timeFrame === 'year' ? {
        '>=': getStartDateOfYears(new Date().getFullYear()).toISOString(),
        '<=': getEndDateOfYears(new Date().getFullYear()).toISOString(),
      } : null;

      const where = {
        user: id,
        date: dateRange,
      };

      const transactions = await Transaction.find()
        .where(where)
        .meta({ enableExperimentalDeepTargets: true })
        .sort('date DESC')
        .select(['id', 'amount', 'date', 'type']);

      if (!transactions) {
        return res.badRequest({ message: 'Failed to get transactions' });
      }

      if (timeFrame === 'week') {
        const result = new Array();
        transactions.map((transaction, index, array) => {
          const { amount, type, date } = transaction;
          const day = new Date(date).getDay();

          if (index === 0) {
            result.push({
              date: new Date(date).toLocaleDateString(),
              income: type === 'income' ? amount : 0,
              expense: type === 'expense' ? amount : 0,
            });
            return;
          }

          const previousTransaction = array[index - 1];
          const previousDay = new Date(previousTransaction.date).getDay();

          if (day === previousDay) {
            if (type === 'income') {
              result[result.length - 1].income += amount;
            }

            if (type === 'expense') {
              result[result.length - 1].expense += amount;
            }
          }

          if (day !== previousDay) {
            result.push({
              date: new Date(date).toLocaleDateString(),
              income: type === 'income' ? amount : 0,
              expense: type === 'expense' ? amount : 0,
            });
          }
        });

        return res.ok( result );
      }

      if (timeFrame === 'month') {
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
      }

      if (timeFrame === 'year') {
        // const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        let result = transactions;

        return res.ok( result );
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
};

