const request = require('supertest');
const app = require('../server.js');

describe('User API', () => {
  let userId;
  let userEmail = 'testuser@example.com';
  let userPassword = 'Password123';

  // Register users testcase
  describe('POST /api/users/register', () => {
    test('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          email: userEmail,
          password: userPassword,
          first_name: 'John',
          last_name: 'Doe',
          phone_number: '1234567890'
        });

      userId = response.body.user.id;

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
    });
  });

  // Logging in testcase
  describe('POST /api/users/login', () => {
    test('should log in the user successfully', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: userEmail,
          password: userPassword
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('jwtToken');
    });

    test('should return 401 for incorrect password', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: userEmail,
          password: 'WrongPassword'
        })
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
  });

  // update profile testcase
  describe('PUT /api/users/id/:id', () => {
    test('should update the user profile successfully', async () => {
      const response = await request(app)
        .put(`/api/users/id/${userId}`) 
        .send({
          email: 'updateduser@example.com',
          phone_number: '1112223333',
          first_name: 'Updated',
          last_name: 'User'
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'User updated successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', 'updateduser@example.com');
      expect(response.body.user).toHaveProperty('phone_number', '1112223333');
      expect(response.body.user).toHaveProperty('first_name', 'Updated');
      expect(response.body.user).toHaveProperty('last_name', 'User');
    });
  });

  // delete testcase
  describe('DELETE /api/users/id/:id', () => {
    test('should delete the registered user successfully', async () => {
      const response = await request(app)
        .delete(`/api/users/id/${userId}`) 
        .expect(200);

      expect(response.body).toHaveProperty('message', 'User deleted successfully');
    });

    test('should return 404 for a non-existent user', async () => {
      const response = await request(app)
        .delete(`/api/users/id/${userId + 9999}`) 
        .expect(404);

      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });
});
