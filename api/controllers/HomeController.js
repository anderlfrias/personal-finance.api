/**
 * HomeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  index: async function (req, res) {
    res.ok({
      name: 'Wallet Admin API',
      version: '1.0.0',
      description: 'Administrador de finanzas personales',
    });
  }

};

