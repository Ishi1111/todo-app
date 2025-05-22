import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import { User } from '../models/user.model';
import { handleError } from '../utils/errorHandler';


/**
 * Handles user signup process
 * @route POST /auth/signup
 * @param {Request} req - Express request object containing user registration details
 * @param {Response} res - Express response object for sending signup result
 * @returns {Promise<void>} - Resolves with created user token or error response
 * @description Creates a new user account, checks email uniqueness, hashes password, and generates authentication token
 */
export const signup = async (req: Request, res: Response): Promise<void> => {
   try {
      // Check email uniqueness
      const existing = await checkEmailExists(req?.body?.email);
      if (existing) {
         res.status(409).json({ message: 'Email already exists!' });
      }

      // Encrypt password
      const hashedPassword = await bcrypt.hash(req?.body?.password, 10);

      // Create user
      const user = await User.create({
         email: req?.body?.email,
         name: req?.body?.name,
         password: hashedPassword
      });

      // Generate access token
      const token = generateToken({ userId: user.id.toString() });

      res.status(201).json({
         message: 'User created successfully',
         token,
      });
   } catch (error) {
      return handleError(res, error);
   }
};

/**
 * Handles user login authentication
 * @route POST /auth/login
 * @param {Request} req - Express request object containing user credentials
 * @param {Response} res - Express response object for sending login result
 * @returns {Promise<void>} Sends JWT token on successful login or error message
 */
export const login = async (req: Request, res: Response): Promise<void> => {
   try {
      const { email, password } = req.body;

      // Check email exist
      const user = await checkEmailExists(email);
      if (!user) {
         res.status(400).json({ message: 'Please enter a registered email address.' });

      } else {
         // Validate password
         const match = await bcrypt.compare(password, user.password);
         if (!match) {
            res.status(400).json({ message: 'Invalid credentials!' });
         }

         // Generate token
         const token = generateToken({ userId: user.id.toString() });

         res.status(200).json({
            message: 'Login successful',
            token,
         });
      }
   } catch (error) {
      return handleError(res, error);
   }
};


/**
 * Checks if a user with the given email exists in the database
 * @param {string} email - The email address to check for existence
 * @returns {Promise<UserData | null>} The user data if found, or null if no user exists
 * @throws {Error} Throws an error if there's an issue querying the database
 */
const checkEmailExists = async (email: string): Promise<UserData | null> => {
   try {
      return await User.findOne({ email: new RegExp(`^${email}$`, 'i') }).select('id email password');
   } catch (error) {
      throw new Error('Error checking email existence');
   }
}

interface UserData {
   id: string,
   email: string,
   password: string
}
