/* eslint-disable */
import { Selector } from 'testcafe';
const userRepositories = require('../repositories/userRepositories');

fixture `CodePen Signup`
  .page`http://localhost:3000/signup`
  .before(async (t) => {
      userRepositories.deleteUsers();
  });

test('Add an user succeeded will redirect to login page', async t => {
    const newUser = {
      username: "johnsmith",
      email: "jsmith@mail.com",
      password: "Password",
      cfpassword: "Password"
    }
    await t
        .typeText('#username', newUser.username)
        .typeText('#email', newUser.email)
        .typeText('#password', newUser.password)
        .typeText('#cfpassword', newUser.cfpassword)
        .click('#signup-button')
        .expect(Selector('#login-form').exists).eql(true);
});

test('Add an user with incorrect email format will show email error', async t => {
    const newUser = {
      username: "johnsmith",
      email: "jsmith",
      password: "Password",
      cfpassword: "Password"
    }
    await t
        .typeText('#username', newUser.username)
        .typeText('#email', newUser.email)
        .typeText('#password', newUser.password)
        .typeText('#cfpassword', newUser.cfpassword)
        .click('#signup-button')
        .expect(Selector('#error-email').exists).eql(true);
});

test('Add an user with different password and cfpassword will show an error message', async t => {
    const newUser = {
      username: "johnsmith",
      email: "jsmith@mail.com",
      password: "Password1",
      cfpassword: "Password"
    }
    await t
        .typeText('#username', newUser.username)
        .typeText('#email', newUser.email)
        .typeText('#password', newUser.password)
        .typeText('#cfpassword', newUser.cfpassword)
        .click('#signup-button')
        .expect(Selector('#error-message').exists).eql(true);
});

fixture `CodePen Login`
  .page`http://localhost:3000/login`

test('Login with an incorrect password with show error message', async t => {
    const newUser = {
      username: "johnsmith",
      password: "Password123",
    }
    await t
        .typeText('#username', newUser.username)
        .typeText('#password', newUser.password)
        .click('#login-button')
        .expect(Selector('#error-message').exists).eql(true);
});

test('Login with an user with lead to dashboard', async t => {
    const newUser = {
      username: "johnsmith",
      password: "Password",
    }
    await t
        .typeText('#username', newUser.username)
        .typeText('#password', newUser.password)
        .click('#login-button')
        .expect(Selector('#dashboard-main').exists).eql(true);
});

