/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require('bcrypt');
const sign = require('jwt-encode');
module.exports = {
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

      if (!name || !firstSurname || !email || !username || !unencryptedPassword) {
        return res.badRequest({
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
          user,
        });
      }

      return res.badRequest({
        message: 'Error creating user',
      });
    } catch (err) {
      return res.serverError({
        message: 'Server error',
        err,
      });
    }
  },

  update: async function (req, res) {
    try {
      const { id } = req.params;
      const { name, firstSurname, secondSurname, role, isActive } = req.body;

      if (!id) {
        return res.badRequest({
          message: 'Id not provided',
        });
      }

      if (!name || !firstSurname || !email || !username || !password || !role) {
        return res.badRequest({
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
          message: 'User updated',
          user,
        });
      }

      return res.badRequest({
        message: 'Error updating user',
      });
    } catch (err) {
      return res.serverError({
        message: 'Server error',
        err,
      });
    }
  },

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

  get: async function (req, res) {
    try {
      const { q = '' } = req.allParams();

      console.log(q);
      const users = await User.find({
        where: {
          or: [
            { name: { contains: q } },
            { firstSurname: { contains: q } },
            { secondSurname: { contains: q } },
            { email: { contains: q } },
            { username: { contains: q } },
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

  login: async function (req, res) {
    try {
      const { user : userToLoging, password } = req.body;

      const byUsername = await User.findOne({ username: userToLoging});
      const byEmail = await User.findOne({ email: userToLoging });

      if (!byUsername && !byEmail){
        return res.badRequest({
          messageCode: 'E_INVALID_CREDENTIALS',
          message: 'Invalid credentials',
        });
      }

      const user = byUsername || byEmail;

      if (!user || !password) {
        return res.badRequest({
          message: 'Missing fields',
        });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        return res.badRequest({
          message: 'Invalid credentials',
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

      if (!jwt) {
        return res.badRequest({
          messageCode: 'E_FAILED_TO_AUTHENTICATE',
          message: 'Failed to authenticate user',
        });
      }

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

