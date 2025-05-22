
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload as DefaultJwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JwtPayload extends DefaultJwtPayload {
   userId: string;
}

declare module 'express-serve-static-core' {
   interface Request {
      user?: { id: string };
   }
}

/**
 * Generates a JWT token for a given user payload.
 */
export const generateToken = (payload: { userId: string }): string => {
   try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
   } catch (err) {
      throw err;
   }
};

/**
 * Middleware function to authenticate requests using JWT.
 * Validates the Authorization header, verifies the JWT token,
 * and attaches the user ID to the request object if valid.
 * 
 * @param req Express request object
 * @param res Express response object
 * @param next Express next middleware function
 * @throws {Error} If token is invalid, expired, or missing
 */
export const authenticate = async (
   req: Request, res: Response, next: NextFunction
): Promise<void> => {
   try {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith('Bearer ')) {
         res.status(401).json({ message: 'Authorization header missing or invalid' });
         return;
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
         res.status(401).json({ message: 'Invalid token payload' });
         return;
      }

      req.user = { id: decoded.userId };
      next();
   } catch (error) {
      console.error('JWT verification failed:', error);
      res.status(401).json({ message: 'Invalid or expired token' });
   }
};


