import request from 'supertest';
import mongoose from 'mongoose';
import userModel from '../../models/userModel.js';
import { app, server } from '../../server.js';

// Mock Mongoose model to avoid hitting the database in unit tests
jest.mock('../../models/userModel');

describe('User Authentication API Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close(); // Ensure the server is closed after tests
  });

  // Test Case 1: Successful User Registration
  it('should register a new user successfully', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      phone: '1234567890',
      address: '123 Street, City',
    };

    userModel.prototype.save = jest.fn().mockResolvedValue(newUser);

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(newUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User Register Successfully');
  });

  // Test Case 2: User Already Registered
  it('should return an error if the user is already registered', async () => {
    const existingUser = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      phone: '1234567890',
      address: '123 Street, City',
    };

    // Simulate existing user in DB
    userModel.findOne = jest.fn().mockResolvedValue(existingUser);

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(existingUser);

    expect(res.statusCode).toEqual(200); // Assuming your API returns 200 for already registered users
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Already Registered please Login');
  });

  // Test Case 3: Invalid Login Credentials
  it('should reject login with incorrect credentials', async () => {
    const loginData = {
      email: 'john@example.com',
      password: 'wrongpassword',
    };

    // Simulate user found but incorrect password
    userModel.findOne = jest.fn().mockResolvedValue({
      ...loginData,
      password: '$2b$10$hashedpasswordexample', // Fake hashed password
      _id: 'userId123',
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send(loginData);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid password');
  });
});
