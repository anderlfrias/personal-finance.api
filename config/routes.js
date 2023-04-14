/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': 'HomeController.index',


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/

  /*=============================================
  =         Routes of UserController            =
  =============================================*/
  'GET /api/v1/user': 'UserController.get',
  'GET /api/v1/user/:id': 'UserController.getById',
  'POST /api/v1/user': 'UserController.create',
  'POST /api/v1/user/login': 'UserController.login',
  'PUT /api/v1/user/:id': 'UserController.update',
  'DELETE /api/v1/user/:id': 'UserController.delete',
  'POST /api/v1/user/confirm-email': 'UserController.activateAccount',
  'POST /api/v1/user/send-confirmation-email': 'UserController.sendConfirmationEmail',
  'PUT /api/v1/user/change-password/:id': 'UserController.changePassword',
  'POST /api/v1/user/forgot-password': 'UserController.forgetPassword',
  'POST /api/v1/user/reset-password': 'UserController.resetPassword',
  /*=====  End of Routes of UserController  ======*/

  /*=============================================
  =         Routes of WalletController         =
  =============================================*/
  'GET /api/v1/wallet': 'WalletController.get',
  'GET /api/v1/wallet/:id': 'WalletController.getById',
  'GET /api/v1/wallet/total/balance': 'WalletController.getTotalBalance',
  'POST /api/v1/wallet': 'WalletController.create',
  'PUT /api/v1/wallet/:id': 'WalletController.update',
  'DELETE /api/v1/wallet/:id': 'WalletController.delete',
  /*=====  End of Routes of WalletController  ======*/

  /*=============================================
  =         Routes of CategoryController       =
  =============================================*/
  'GET /api/v1/category': 'CategoryController.get',
  'GET /api/v1/category/:id': 'CategoryController.getById',
  'POST /api/v1/category': 'CategoryController.create',
  'PUT /api/v1/category/:id': 'CategoryController.update',
  'DELETE /api/v1/category/:id': 'CategoryController.delete',
  /*=====  End of Routes of CategoryController  ======*/

  /*=============================================
  =         Routes of TransactionController    =
  =============================================*/
  'GET /api/v1/transaction': 'TransactionController.get',
  'GET /api/v1/transaction/:id': 'TransactionController.getById',
  'POST /api/v1/transaction': 'TransactionController.create',
  'PUT /api/v1/transaction/:id': 'TransactionController.update',
  'DELETE /api/v1/transaction/:id': 'TransactionController.delete',
  /*=====  End of Routes of TransactionController  ======*/

  /*=============================================
  =         Routes of BudgetController         =
  =============================================*/
  'GET /api/v1/budget': 'BudgetController.get',
  'GET /api/v1/budget/:id': 'BudgetController.getById',
  'POST /api/v1/budget': 'BudgetController.create',
  'PUT /api/v1/budget/:id': 'BudgetController.update',
  'DELETE /api/v1/budget/:id': 'BudgetController.delete',
  /*=====  End of Routes of BudgetController  ======*/

  /*=============================================
  =         Routes of StatisticsController     =
  =============================================*/
  'GET /api/v1/statistics': 'StatisticsController.get',
  'GET /api/v1/statistics/timeframe': 'StatisticsController.getByTimeframe',
  'GET /api/v1/statistics/category': 'StatisticsController.getAverageByCategory',
};
