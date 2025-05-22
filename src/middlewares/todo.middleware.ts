import { query, Result, ValidationError } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { body } from 'express-validator';

// List todos
export const validateTodoQuery = [
   query('status')
      .optional()
      .isIn(['completed', 'pending'])
      .withMessage('Status must be either "completed" or "pending"'),

   query('limit')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Limit must be a positive integer'),

   query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),

   query('search')
      .optional()
      .isString()
      .withMessage('Search must be a string')
];


// Create todo
export const validateCreateTodo = [
   body('title')
      .notEmpty()
      .withMessage('Title is required')
      .isString()
      .withMessage('Title must be a string'),

   body('description')
      .optional()
      .isString()
      .withMessage('Description must be a string'),

   body('dueDate')
      .notEmpty()
      .withMessage('Due date is required')
      .isISO8601()
      .withMessage('Due date must be a valid ISO 8601 date (e.g., 2025-05-22)')
];


// update todo 
export const validateUpdateTodo = [
   body('title')
      .optional()
      .isString()
      .withMessage('Title must be a string'),
   body('description')
      .optional()
      .isString()
      .withMessage('Description must be a string'),
   body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Due date must be in YYYY-MM-DD format'),
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
