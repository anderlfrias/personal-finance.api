/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require('bcrypt');
const sign = require('jwt-encode');
const jwtDecode = require('jwt-decode');
const jwt = require('jsonwebtoken');
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
        password: unencryptedPassword
      } = req.body;

      const userExists = await User.findOne({ username: username.trim().toLowerCase() });

      if (userExists) {
        return res.badRequest({
          message: 'User already exists',
          messageCode: 'username_exists',
        });
      }

      const emailExists = await User.findOne({ email: email.trim().toLowerCase() });

      if (emailExists) {
        return res.badRequest({
          message: 'Email already exists',
          messageCode: 'email_exists',
        });
      }

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
          messageCode: 'failed_to_login',
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

  update: async function (req, res) {
    try {
      const { id } = req.params;
      const { name, firstSurname, secondSurname } = req.body;

      if (!id) {
        return res.badRequest({
          message: 'Id not provided',
        });
      }

      if (!name || !firstSurname) {
        return res.badRequest({
          message: 'Missing fields',
        });
      }

      const user = await User.updateOne({ id }).set({
        name,
        firstSurname,
        secondSurname
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

      const userExists = await User.findOne({ id });

      if (!userExists) {
        return res.badRequest({
          message: 'User does not exist',
          messageCode: 'user-not-found'
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

      if (!userToLoging || !password) {
        return res.badRequest({
          messageCode: 'missing_fields',
          message: 'Missing fields',
        });
      }

      const byUsername = await User.find({ username: userToLoging}).limit(1);
      const byEmail = await User.find({ email: userToLoging }).limit(1);

      if (!byUsername[0] && !byEmail[0]){
        return res.badRequest({
          messageCode: 'invalid_credentials',
          message: 'Invalid credentials',
        });
      }

      const user = byUsername[0] || byEmail[0];

      // if (!user.isActive) {
      //   return res.badRequest({
      //     messageCode: 'user_not_active',
      //     message: 'User not active',
      //   });
      // }
      // Load hash from your password DB.
      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        return res.badRequest({
          messageCode: 'invalid_credentials',
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
          messageCode: 'failed_to_login',
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
  sendConfirmationEmail: async function (req, res) {
    try {
      const { authorization } = req.headers;
      const { confirmEmailLink } = req.body;

      const { id: userId } = jwtDecode(authorization);

      if (!userId) {
        return res.badRequest({
          message: 'Missing fields',
        });
      }

      const user = await User.findOne({ id: userId });

      if (!user) {
        return res.badRequest({
          message: 'User not found',
          messageCode: 'user-not-found',
        });
      }

      const secret = sails.config.session.secret;
      const data = {
        id: user.id,
      };

      const token = sign(data, secret);

      sails.hooks.email.send('confirmEmail',
      {
        confirmLink: `${confirmEmailLink}/${token}`,
        userFirstname: user.name,
      },
      {
        to: user.email,
        subject: 'Confirmación de correo electrónico',
      },
      (err) => {
        if (err) {
          return res.serverError({
            message: 'Server error',
            err,
          });
        }

        return res.ok({
          message: 'Email sent',
        });
      });
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        error,
      });
    }
  },
  activateAccount: async function (req, res) {
    try {
      const { authorization : token } = req.headers;

      if (!token) {
        return res.badRequest({ message: 'Token not provided' });
      }

      jwt.verify(token, sails.config.session.secret, async (_err, decoded) => {
        if (_err) {
          return res.badRequest({
            message: 'Invalid token',
            messageCode: 'invalid-token',
          });
        }

        const { id } = decoded;

        if (!id) {
          return res.badRequest({
            message: 'Id not provided',
            messageCode: 'id-not-provided',
          });
        }

        const user = await User.findOne({ id });

        if (!user) {
          return res.badRequest({
            message: 'User not found',
            messageCode: 'user-not-found',
          });
        }

        if (user.isActive) {
          return res.ok({
            message: 'User already activated',
            messageCode: 'user-already-activated',
          });
        }

        const userUpdated = await User.updateOne({ id }).set({
          isActive: true,
        });

        if (userUpdated) {
          return res.ok({
            message: 'User activated'
          });
        }

        return res.badRequest({
          message: 'Error activating user',
          messageCode: 'error-activating-user',
        });
      });
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        error,
      });
    }
  },
  changePassword: async function (req, res) {
    try {
      const { id:userId } = req.allParams();
      const { password, newPassword } = req.body;

      if (!password || !newPassword || !userId) {
        return res.badRequest({
          message: 'Missing fields',
          messageCode: 'missing-fields',
        });
      }

      const user = await User.findOne({ id: userId });

      if (!user) {
        return res.badRequest({
          message: 'User not found',
          messageCode: 'user-not-found',
        });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        return res.badRequest({
          message: 'Invalid password',
          messageCode: 'invalid-password',
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(newPassword, salt);

      const userUpdated = await User.updateOne({ id: userId }).set({
        password: hash,
      });

      if (userUpdated) {
        return res.ok({
          message: 'Password updated',
        });
      }

      return res.badRequest({
        message: 'Error updating password',
        messageCode: 'error-updating-password',
      });

    } catch (error) {
      return res.serverError({
        message: 'Server error',
        error,
      });
    }
  },
  forgetPassword: async function (req, res) {
    try {
      const { email, forgotPasswordLink } = req.body;

      if (!email) {
        return res.badRequest({
          message: 'Missing fields',
          messageCode: 'missing-fields',
        });
      }

      const userExists = await User.find({ email }).limit(1);
      const user = userExists[0];

      if (!user) {
        return res.ok();
      }

      const secret = sails.config.session.secret;
      const data = {
        id: user.id,
      };

      const token = sign(data, secret);

      sails.hooks.email.send('forgotPassword',
      {
        changePasswordLink: `${forgotPasswordLink}/${token}`,
        userFirstname: user.name,
      },
      {
        to: user.email,
        subject: 'Recuperación de contraseña',
      },
      (err) => {
        if (err) {
          return res.serverError({
            message: 'Server error',
            err,
          });
        }

        return res.ok({
          message: 'Email sent',
        });
      });

    } catch (error) {
      return res.serverError({
        message: 'Server error',
        error,
      });
    }
  },
  resetPassword: async function (req, res) {
    try {
      const { authorization : token } = req.headers;
      const { password } = req.body;

      jwt.verify(token, sails.config.session.secret, async (_err, decoded) => {
        if (_err) {
          return res.badRequest({
            message: 'Invalid token',
            messageCode: 'invalid-token',
          });
        }

        const { id } = decoded;

        if (!id) {
          return res.badRequest({
            message: 'Id not provided',
            messageCode: 'id-not-provided',
          });
        }

        const user = await User.findOne({ id });

        if (!user) {
          return res.badRequest({
            message: 'User not found',
            messageCode: 'user-not-found',
          });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const userUpdated = await User.updateOne({ id: user.id }).set({
          password: hash,
        });

        if (userUpdated) {
          return res.ok({
            message: 'Password updated',
          });
        }

        return res.badRequest({
          message: 'Error updating password',
          messageCode: 'error-updating-password',
        });

      });
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        error,
      });
    }
  },
  getTotal: async function (req, res) {
    try {
      const { authorization : token } = req.headers;

      if (!token) {
        return res.badRequest({ message: 'Token not provided' });
      }

      const { id } = jwtDecode(token);

      if (!id) {
        return res.badRequest({
          message: 'Id not provided',
          messageCode: 'id-not-provided',
        });
      }

      const user = await User.findOne({ id });

      if (!user) {
        return res.badRequest({
          message: 'User not found',
          messageCode: 'user-not-found',
        });
      }

      const transactions = await Transaction.count({ user: user.id });
      const wallets = await Wallet.count({ user: user.id });
      const categories = await Category.count({ user: user.id });
      const budgets = await Budget.count({ user: user.id });

      return res.ok({
        transactions,
        wallets,
        categories,
        budgets,
      });
    } catch (error) {
      return res.serverError({
        message: 'Server error',
        error,
      });
    }
  }
};

