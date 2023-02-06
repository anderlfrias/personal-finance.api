/**
 * CategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const jwtDecode = require('jwt-decode');
module.exports = {
  create: async (req, res) => {
    try {
      const { name, description } = req.body;
      const { authorization: token } = req.headers;

      if (!token) {
        return res.badRequest({ message: 'Token not provided' });
      }

      const user = jwtDecode(token);

      if (!name) {
        return res.badRequest({ message: 'Missing fields' });
      }

      const category = await Category.create({ name, description, user: user.id }).fetch();
      res.ok({ category });
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        error,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { name, description } = req.body;
      const { authorization: token } = req.headers;
      const { id } = req.params;

      if (!token) {
        return res.badRequest({ message: 'Token not provided' });
      }

      const user = jwtDecode(token);

      if (!name) {
        return res.badRequest({ message: 'Missing fields' });
      }

      const category = await Category.updateOne({ id, user: user.id }).set({ name, description });
      res.ok({ category });
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        error,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { authorization: token } = req.headers;
      const { id } = req.params;

      if (!token) {
        return res.badRequest({ message: 'Token not provided' });
      }

      const user = jwtDecode(token);

      const category = await Category.destroyOne({ id, user: user.id });
      res.ok({ category });
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        error,
      });
    }
  },

  get: async (req, res) => {
    try {
      const { authorization: token } = req.headers;

      if (!token) {
        return res.badRequest({ message: 'Token not provided' });
      }

      const user = jwtDecode(token);

      const categories = await Category.find({ user: user.id });
      res.ok( categories );
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        error,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const { authorization: token } = req.headers;
      const { id } = req.params;

      if (!token) {
        return res.badRequest({ message: 'Token not provided' });
      }

      const user = jwtDecode(token);

      const category = await Category.findOne({ id, user: user.id });
      res.ok( category );
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        error,
      });
    }
  }

};

