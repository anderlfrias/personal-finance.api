/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const bcrypt = require('bcrypt');
module.exports = {
  /*=============================================
  =            Create User Function            =
  =============================================*/
  create: async function (req, res) {
    try {
      const saltRounds = 10;
      const {
        name,
        firstSurname,
        secondSurname,
        email,
        username,
        password: unencryptedPassword,
      } = req.body;

      if (!name || !firstSurname || !email || !username || !password) {
        return res.badRequest({
          message: 'Missing fields',
          code: 'E_MISSING_FIELDS',
        });
      }

      const encryptedPassword = bcrypt.hashSync(unencryptedPassword, saltRounds);

      const user = await User.create({
        name,
        firstSurname,
        secondSurname,
        email: email.trim().toLowerCase(),
        username: username.trim().toLowerCase(),
        password: encryptedPassword,
      }).fetch();

      if (user) {
        return res.ok({
          message: 'User created',
          code: 'E_USER_CREATED',
          user,
        });
      }

      return res.badRequest({
        message: 'Error creating user',
        code: 'E_ERROR_CREATING_USER',
      });
    } catch (err) {
      return res.serverError({
        message: 'Server error',
        code: 'E_SERVER_ERROR',
        err,
      });
    }
  },
  /*=====  End of Create User Function  ======*/

  /*=============================================
  =            Update User Function            =
  =============================================*/
  update: async function (req, res) {
    try {
      const { id } = req.params;
      const { name, firstSurname, secondSurname, role, isActive } = req.body;

      if (!id) {
        return res.badRequest({
          message: 'Id not provided',
          code: 'E_ID_NOT_PROVIDED',
        });
      }

      if (!name || !firstSurname || !email || !username || !password || !role) {
        return res.badRequest({
          message: 'Missing fields',
          code: 'E_MISSING_FIELDS',
        });
      }

      const user = await User.updateOne({ id }).set({
        name,
        firstSurname,
        secondSurname,
        role,
        isActive,
      });

      if (user) {
        return res.ok({
          message: 'User updated',
          code: 'E_USER_UPDATED',
          user,
        });
      }

      return res.badRequest({
        message: 'Error updating user',
        code: 'E_ERROR_UPDATING_USER',
      });
    } catch (err) {
      return res.serverError({
        message: 'Server error',
        code: 'E_SERVER_ERROR',
        err,
      });
    }
  },
  /*=====  End of Update User Function  ======*/

  /*=============================================
  =            Delete User Function            =
  =============================================*/
  delete: async function (req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.badRequest({
          message: 'Id not provided',
          code: 'E_ID_NOT_PROVIDED',
        });
      }

      const user = await User.destroyOne({ id });

      if (user) {
        return res.ok({
          message: 'User deleted',
          code: 'E_USER_DELETED',
          user,
        });
      }

      return res.badRequest({
        message: 'Error deleting user',
        code: 'E_ERROR_DELETING_USER',
      });
    } catch (err) {
      return res.serverError({
        message: 'Server error',
        code: 'E_SERVER_ERROR',
        err,
      });
    }
  },
  /*=====  End of Delete User Function  ======*/

  /*=============================================
  =          Get User By Id Function            =
  =============================================*/
  getById: async function (req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.badRequest({
          message: 'Id not provided',
          code: 'E_ID_NOT_PROVIDED',
        });
      }

      const user = await User.findOne({ id });

      if (user) {
        return res.ok({
          message: 'User found',
          code: 'E_USER_FOUND',
          user: {
            id: user.id,
            name: user.name,
            firstSurname: user.firstSurname,
            secondSurname: user.secondSurname,
            email: user.email,
            username: user.username,
            role: user.role,
            isActive: user.isActive,
          }
        });
      }

      return res.badRequest({
        message: 'Error finding user',
        code: 'E_ERROR_FINDING_USER',
      });
    } catch (err) {
      return res.serverError({
        message: 'Server error',
        code: 'E_SERVER_ERROR',
        err,
      });
    }
  },
  /*=====  End of Get User Function  ======*/

  /*=============================================
  =            Get All Users Function            =
  =============================================*/
  get: async function (req, res) {
    try {
      const { b } = req.allParams();

      const users = await User.find({
        where: {
          or: [
            { name: { contains: b } },
            { firstSurname: { contains: b } },
            { secondSurname: { contains: b } },
            { email: { contains: b } },
            { username: { contains: b } },
          ],
        },
      }).meta({ makeLikeModifierCaseInsensitive: true });

      if (users) {
        return res.ok({
          message: 'Users found',
          code: 'E_USERS_FOUND',
          users: users.map(user => ({
            id: user.id,
            name: user.name,
            firstSurname: user.firstSurname,
            secondSurname: user.secondSurname,
            email: user.email,
            username: user.username,
            role: user.role,
            isActive: user.isActive,
          })),
        });
      }

      return res.badRequest({
        message: 'Error finding users',
        code: 'E_ERROR_FINDING_USERS',
      });
    } catch (err) {
      return res.serverError({
        message: 'Server error',
        code: 'E_SERVER_ERROR',
        err,
      });
    }
  },
  /*=====  End of Get All Users Function  ======*/

};

