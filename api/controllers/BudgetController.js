/**
 * BudgetController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function (req, res) {
    try {
      const { name, description, amount, startDate, endDate, category } = req.body;
      const {authorization : token } = req.headers;

      if (!token) {
        return res.badRequest({
          messageCode: 'E_UNAUTHORIZED',
          message: 'Token not provided',
        });
      }

      const {id : user} = jwtDecode(token);

      if (!name || !amount || !startDate || !endDate || !category || !user) {
        return res.badRequest({
          messageCode: 'E_MISSING_FIELDS',
          message: 'Missing required fields',
        });
      }

      const budget = await Budget.create({
        name,
        description,
        amount,
        startDate,
        endDate,
        category,
        user
      });

      if (!budget) {
        return res.badRequest({
          messageCode: 'E_FAILED_TO_CREATE_BUDGET',
          message: 'Budget could not be created',
        });
      }

      return res.ok({
        budget
      });
    } catch (error) {
      return res.serverError({
        messageCode: 'E_SERVER_ERROR',
        message: 'Server error',
        error,
      });
    }
  },
  update: async function (req, res) {
    try {
      const { name, description, amount, startDate, endDate, category } = req.body;
      const { id } = req.params;

      if (!id) {
        return res.badRequest({
          messageCode: 'E_ID_NOT_PROVIDED',
          message: 'Id not provided',
        });
      }

      if (!name || !amount || !startDate || !endDate || !category) {
        return res.badRequest({
          messageCode: 'E_MISSING_FIELDS',
          message: 'Missing required fields',
        });
      }

      const budget = await Budget.updateOne({ id }).set({
        name,
        description,
        amount,
        startDate,
        endDate,
        category
      });

      if (!budget) {
        return res.badRequest({
          messageCode: 'E_FAILED_TO_UPDATE_BUDGET',
          message: 'Budget could not be updated',
        });
      }

      return res.ok({
        budget
      });
    } catch (error) {
      return res.serverError({
        messageCode: 'E_SERVER_ERROR',
        message: 'Server error',
        error,
      });
    }
  },
  get: async function (req, res) {
    try {
      const budgets = await Budget.find();

      if (!budgets) {
        return res.badRequest({
          messageCode: 'E_FAILED_TO_GET_BUDGETS',
          message: 'Budgets could not be retrieved',
        });
      }

      return res.ok(budgets);
    } catch (error) {
      return res.serverError({
        messageCode: 'E_SERVER_ERROR',
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
          messageCode: 'E_ID_NOT_PROVIDED',
          message: 'Id not provided',
        });
      }

      const budget = await Budget.findOne({ id });

      if (!budget) {
        return res.badRequest({
          messageCode: 'E_FAILED_TO_GET_BUDGET',
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

