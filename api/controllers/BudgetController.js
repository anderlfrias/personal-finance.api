/**
 * BudgetController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const jwtDecode = require('jwt-decode');
module.exports = {
  create: async function (req, res) {
    try {
      const { name, amount, startDate, endDate, user } = req.body;

      if (!name || !amount || !startDate || !endDate || !user) {
        return res.badRequest({
          messageCode: 'missing_fields',
          message: 'Missing required fields',
        });
      }

      const userExist = await User.findOne({ id: user });

      if (!userExist) {
        return res.badRequest({
          messageCode: 'user_does_not_existd',
          message: 'User does not exist',
        });
      }

      const budget = await Budget.create({
        name,
        amount,
        startDate,
        endDate,
        user
      }).fetch();

      if (!budget) {
        return res.badRequest({
          messageCode: 'failed_to_create_budget',
          message: 'Budget could not be created',
        });
      }

      return res.ok({
        budget
      });
    } catch (error) {
      return res.serverError({
        messageCode: 'server_error',
        message: 'Server error',
        error,
      });
    }
  },
  update: async function (req, res) {
    try {
      const { name, amount, startDate, endDate } = req.body;
      const { id } = req.params;

      if (!id) {
        return res.badRequest({
          messageCode: 'E_ID_NOT_PROVIDED',
          message: 'Id not provided',
        });
      }

      if (!name || !amount || !startDate || !endDate) {
        return res.badRequest({
          messageCode: 'E_MISSING_FIELDS',
          message: 'Missing required fields',
        });
      }

      const budget = await Budget.updateOne({ id }).set({
        name,
        amount,
        startDate,
        endDate
      });

      if (!budget) {
        return res.badRequest({
          messageCode: 'failed_to_update_budget',
          message: 'Budget could not be updated',
        });
      }

      return res.ok({
        budget
      });
    } catch (error) {
      return res.serverError({
        messageCode: 'server_error',
        message: 'Server error',
        error,
      });
    }
  },
  delete: async function (req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.badRequest({
          messageCode: 'id_not_provided',
          message: 'Id not provided',
        });
      }

      const budget = await Budget.destroyOne({ id });

      if (!budget) {
        return res.badRequest({
          messageCode: 'failed_to_delete_budget',
          message: 'Budget could not be deleted',
        });
      }

      return res.ok({
        budget
      });
    } catch (error) {
      return res.serverError({
        messageCode: 'server_error',
        message: 'Server error',
        error,
      });
    }
  },
  get: async function (req, res) {
    try {
      const { authorization : token } = req.headers;
      const { q } = req.query;
      const active = req.query.active === 'true' ? true : false;

      if (!token) {
        return res.badRequest({
          messageCode: 'token_not_provided',
          message: 'Token not provided',
        });
      }

      const { id } = jwtDecode(token);

      if (active) {
        const budgets = await Budget.find()
          .where({
            user: id,
            name: { contains: q || '' },
            startDate: { '<=': new Date().toISOString() },
            endDate: { '>=': new Date().toISOString() }
          })
          .meta({ enableExperimentalDeepTargets: true, makeLikeModifierCaseInsensitive: true })
          .populate('transactions')
          .sort('endDate DESC');

        if (!budgets) {
          return res.badRequest({
            messageCode: 'failed_to_get_budgets',
            message: 'Budgets could not be retrieved',
          });
        }

        return res.ok(budgets);
      }

      const budgets = await Budget.find()
        .where({
          user: id,
          name: { contains: q || '' }
        })
        .meta({ enableExperimentalDeepTargets: true, makeLikeModifierCaseInsensitive: true })
        .populate('transactions')
        .sort('endDate DESC');

      if (!budgets) {
        return res.badRequest({
          messageCode: 'failed_to_get_budgets',
          message: 'Budgets could not be retrieved',
        });
      }

      return res.ok(budgets);
    } catch (error) {
      return res.serverError({
        messageCode: 'server_error',
        message: 'Server error',
        error,
      });
    }
  },
  getById: async function (req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.badRequest({
          messageCode: 'id_not_provided',
          message: 'Id not provided',
        });
      }

      const budget = await Budget.findOne({ id });

      if (!budget) {
        return res.badRequest({
          messageCode: 'failed_to_get_budget',
          message: 'Budget could not be retrieved',
        });
      }

      return res.ok(budget);
    } catch (error) {
      return res.serverError({
        messageCode: 'E_SERVER_ERROR',
        message: 'Server error',
        error,
      });
    }
  },
};

