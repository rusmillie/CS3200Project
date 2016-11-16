'use strict';

const Promise = require('bluebird');
const query = require('../lib/utils').query;

/**
 * Get an account with id.
 *
 * @param {Object} req The request object
 * @return {Promise} The promise
 */
function getAccount(req) {
  return query('SELECT admin_name, admin_username FROM admins WHERE admin_id = ' + req.params.id);
}

/**
 * Create an account.
 *
 * @param {Object} req The request object
 * @return {Promise} The promise
 */
function createAccount(req) {
  if (!req.body || !req.body.admin_name || !req.body.admin_username || !req.body.admin_password) {
    return Promise.reject({
      status: 406,
      message: 'Must provide admin\'s name, username, and password'
    });
  }

  return query('INSERT INTO admins (admin_name, admin_username, admin_password) VALUES ("' + req.body.admin_name + '",  "' + req.body.admin_username + '", "' + req.body.admin_password + '") WHERE "' + req.body.admin_username + '" NOT IN (SELECT admin_username FROM admins)')
    .then(function(rows) {
      console.log(rows);
    });
}

/**
 * Update an account.
 *
 * @param {Object} req The request object
 * @return {Promise} The promise
 */
function updateAccount(req) {
  if (!req.body && (!req.body.admin_name && !req.body.admin_username && !req.body.admin_password)) {
    return Promise.reject({
      status: 406,
      message: 'Must provide one of admin\'s name, username, or password'
    });
  }

  return Promise.resolve()
    .then(function() {
      if (req.body.admin_name) {
        return query('UPDATE admins SET admin_name = "' + req.body.admin_name + '" WHERE admin_id = ' + req.params.id);
      }
    })
    .then(function() {
      if (req.body.admin_username) {
        return query('UPDATE admins SET admin_username = "' + req.body.admin_username + '" WHERE admin_id = ' + req.params.id);
      }
    })
    .then(function() {
      if (req.body.admin_password) {
        return query('UPDATE admins SET admin_password = "' + req.body.admin_password + '" WHERE admin_id = ' + req.params.id);
      }
    });
}

/**
 * Delete an account.
 *
 * @param {Object} req The request object
 * @return {Promise} The promise
 */
function deleteAccount(req) {
  return query('DELETE FROM admins WHERE admin_id = ' + req.params.id);
}

module.exports = {
  getAccount, createAccount, updateAccount, deleteAccount
};
