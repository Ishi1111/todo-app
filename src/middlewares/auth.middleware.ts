import { body, ValidationChain, validationResult, ValidationError, Result } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Sign up
export const validateSignup: ValidationChain[] = [
   body('email')
      .exists({ checkFalsy: true }).withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),

   body('name')
      .exists({ checkFalsy: true }).withMessage('Name is required')
      .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long')
      .isLength({ max: 100 }).withMessage('Name can not exceed 100 characters'),

   body('password')
      .exists({ checkFalsy: true }).withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).*$/, "g")
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter and one special character'),
];

// Handle & mange errors
export const handleValidationErrors = (
   req: Request,
   res: Response,
   next: NextFunction
): void => {
   const result: Result<ValidationError> = validationResult(req);

   if (!result.isEmpty()) {
      // mapped() returns an object whose keys are the field names
      const errorMap = result.mapped();

      const extractedErrors = Object.entries(errorMap).map(
         ([field, error]) => ({
            field,
            message: error.msg,
         })
      );

      res.status(422).json({
         message: 'Validation error',
         errors: extractedErrors,
      });
      return;
   }

   next();
};

// Login
export const validateLogin: ValidationChain[] = [
   body('email')
      .exists({ checkFalsy: true }).withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),

   body('password')
      .exists({ checkFalsy: true }).withMessage('Password is required')
];




