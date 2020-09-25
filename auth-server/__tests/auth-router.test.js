'use strict';

require('dotenv').config();
const supergoose = require('@code-fellows/supergoose');
const jwt = require('jsonwebtoken');
const server = require('../server.js');
const req = supergoose(server.app);


describe('Basic error testing', () => {

  it('Should give a 404 error on a bad route', async() => {

    let res = await req.get('/bad');
    expect(res.status).toEqual(404);
    
  });
  
});

describe('Test auth routes', () => {

  it('POST /signup creates a new user and sends an object with the user and the token to the client ', async() => {

    let obj = {
      username: "test",
      password: "test",
      role: "guest"
    };

    let res = await req.post('/signup').send(obj);
    
    expect(res.body.user.role).toEqual("guest");
    expect(res.body.token).toBeTruthy();
    expect(res.body.user).toBeTruthy();
    expect(res.body.user.username).toEqual("test");
    expect(res.status).toEqual(200);
    
  });

  it('POST /signin with basic authentication headers logs in a user and sends an object with the user and the token to the client ', async() => {

    let obj = {
      username: "test",
      password: "test",
    };

    let res = await req.post('/signin').auth("test", "test");
    expect(res.body.token).toBeTruthy();
    expect(res.status).toEqual(200);
    
  });
  
});

describe('Testing for v1 routes', () => {

  it('POST /api/v1/todo adds an item to the DB and returns an object with the added item ', async () => {

    let obj = {
      text: 'this is a todo item',
      assignee: 'joe',
      complete: false,
      difficulty: 3,
    };

    let res = await req.post('/api/v1/todo').send(obj);
    expect(res.body.text).toEqual('this is a todo item');
    expect(res.body._id).toBeDefined();
    expect(res.status).toEqual(200);
    
  });

  it('GET /api/v1/todo returns a list of todo items ', async () => {
    let obj2 = {
      text: 'more text',
      assignee: 'meghan',
      complete: true,
      difficulty: 2,
    };
    
    let res = await req.get('/api/v1/todo');
    expect(res.body.count).toEqual(1);
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.status).toEqual(200);

  });

  it('GET /api/v1/todo/ID returns a single item by ID', async () => {
    
  });

  it('PUT /api/v1/todo/ID returns a single, updated item by ID', async () => {
    
  });

  it('DELETE /api/v1/todo/ID returns an empty object. Subsequent GET for the same ID should result in nothing found', async () => {
    
  });
  
});