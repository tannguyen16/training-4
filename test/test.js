/* eslint-disable linebreak-style */
/* eslint-disable */
const chai = require('chai');
const chaiHttp = require('chai-http');
const { assert } = require('chai');
const db = require('../models');

const app = require('../app');

chai.use(chaiHttp);

describe('Users', () => {
    beforeEach(async function() {
        const deleteUserQuery = 'DELETE FROM "Users"';
        await db.sequelize.query(deleteUserQuery, {
            type: db.sequelize.QueryTypes.DELETE,
        });
    });

    describe('Empty Database', function() {
        it('Users db should be empty', async function() {
            try {
                const selectUserQuery = 'SELECT * FROM "Users"';
                // runs before all tests in this block
                let user = await db.sequelize.query(selectUserQuery, {
                    type: db.sequelize.QueryTypes.SELECT,
                });
                assert.equal(user.length === 0, true, 'Results should be empty');
            } catch (err) {
                throw err;
            }
        });
    })

    describe('Add an User to the Database', function() {
        it('User should be in the Db', async function() {
            try {
                const newUser = {
                    username: 'tnguyen',
                    email: 'tnguyen@mail.com',
                    password: 'Password',
                    cfpassword: 'Password'
                }

                const response = await chai
                                        .request(app)
                                        .post('/user')
                                        .send(newUser);

                const selectUserQuery = 'SELECT * FROM "Users"';

                // runs before all tests in this block
                let user = await db.sequelize.query(selectUserQuery, {
                    type: db.sequelize.QueryTypes.SELECT,
                });
                assert.equal(user.length === 1, true, 'Results should be 1');
            } catch (err) {
                throw err;
            }
        });

        it('User email should be correct', async function() {
            try {
                const newUser = {
                    username: 'tnguyen',
                    email: 'tnguyen@mail.com',
                    password: 'Password',
                    cfpassword: 'Password'
                }

                const response = await chai
                                        .request(app)
                                        .post('/user')
                                        .send(newUser);

                const selectUserQuery = `SELECT * FROM "Users" WHERE "Username" = '${newUser.username}'`;

                // runs before all tests in this block
                let user = await db.sequelize.query(selectUserQuery, {
                    type: db.sequelize.QueryTypes.SELECT,
                });
                assert.equal(user[0].Email === newUser.email, true, 'Email is not correct in the db');
            } catch (err) {
                throw err;
            }
        });

        it('User password should be encrypted', async function() {
            try {
                const newUser = {
                    username: 'tnguyen',
                    email: 'tnguyen@mail.com',
                    password: 'Password',
                    cfpassword: 'Password'
                }

                const response = await chai
                                        .request(app)
                                        .post('/user')
                                        .send(newUser);

                const selectUserQuery = `SELECT * FROM "Users" WHERE "Username" = '${newUser.username}'`;

                // runs before all tests in this block
                let user = await db.sequelize.query(selectUserQuery, {
                    type: db.sequelize.QueryTypes.SELECT,
                });
                assert.equal(user[0].Password !== newUser.password, true, 'Password should be encrypted');
            } catch (err) {
                throw err;
            }
        });
    })
});
