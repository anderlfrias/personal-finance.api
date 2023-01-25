/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require('bcrypt');
const sign = require('jwt-encode');
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
          success: false,
          message: 'Missing fields',
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
          success: true,
          message: 'User created',
          user,
        });
      }

      return res.badRequest({
        success: false,
        message: 'Error creating user',
      });
    } catch (err) {
      return res.serverError({
        success: false,
        message: 'Server error',
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
          success: false,
          message: 'Id not provided',
        });
      }

      if (!name || !firstSurname || !email || !username || !password || !role) {
        return res.badRequest({
          success: false,
          message: 'Missing fields',
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
          success: true,
          message: 'User updated',
          user,
        });
      }

      return res.badRequest({
        success: false,
        message: 'Error updating user',
      });
    } catch (err) {
      return res.serverError({
        success: false,
        message: 'Server error',
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
        });
      }

      const user = await User.destroyOne({ id });

      if (user) {
        return res.ok({
          message: 'User deleted',
          user,
        });
      }

      return res.badRequest({
        message: 'Error deleting user',
      });
    } catch (err) {
      return res.serverError({
        message: 'Server error',
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
        });
      }

      const user = await User.findOne({ id });

      if (user) {
        return res.ok({
          id: user.id,
          name: user.name,
          firstSurname: user.firstSurname,
          secondSurname: user.secondSurname,
          email: user.email,
          username: user.username,
          role: user.role,
          isActive: user.isActive,
        });
      }

      return res.badRequest({
        message: 'Error finding user',
      });
    } catch (err) {
      return res.serverError({
        message: 'Server error',
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
        return res.ok(
          users.map(user => ({
            id: user.id,
            name: user.name,
            firstSurname: user.firstSurname,
            secondSurname: user.secondSurname,
            email: user.email,
            username: user.username,
            role: user.role,
            isActive: user.isActive,
          })),
        );
      }

      return res.badRequest({
        message: 'Error finding users',
      });
    } catch (err) {
      return res.serverError({
        message: 'Server error',
        err,
      });
    }
  },
  /*=====  End of Get All Users Function  ======*/

  /*=============================================
  =            Login Users Function             =
  =============================================*/
  login: async function (req, res) {
    try {
      const { username, email, password } = req.body;

      const user = await User.findOne({
        where: {
          or: [
            { username },
            { email },
          ],
        },
      });

      if (!user || !password) {
        return res.badRequest({
          message: 'Missing fields',
        });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        return res.badRequest({
          message: 'Failed to authenticate',
        });
      }

      const secret = sails.config.session.secret;

      //Data to be encrypted
      const data = {
        id: user.id,
        name: user.name,
        firstSurname: user.firstSurname,
        secondSurname: user.secondSurname,
        email: user.email,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
      };

      const jwt = sign(data, secret);

      return res.ok({
        message: 'User authenticated',
        token: jwt,
      });

    } catch (err) {
      return res.serverError({
        message: 'Server error',
        err,
      });
    }
  },

};

