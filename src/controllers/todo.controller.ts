import { Request, Response } from 'express';
import { Todo } from '../models/todo.model';
import { handleError } from '../utils/errorHandler';
import mongoose from 'mongoose';


/**
 * Creates a new todo item for the authenticated user.
 * 
 * @route POST /todo
 * @param {Object} req.body - Request body containing todo details
 * @param {string} req.body.title - Title of the todo item
 * @param {string} [req.body.description] - Optional description of the todo item
 * @param {Date} req.body.dueDate - Due date for the todo item
 * @returns {Object} JSON response with created todo item and success message
 */
export const createTodo = async (req: any, res: any): Promise<void> => {
   try {
      const { title, description, dueDate } = req.body;

      // Create
      const todo = await Todo.create({
         title,
         description: description ? description : null,
         dueDate,
         user: req.user.id,
      });

      return res.status(201).json({
         message: "Todo created successfully.",
         data: todo
      });

   } catch (error) {
      return handleError(res, error);
   }
};

/**
 * Retrieves a list of todos for the authenticated user with optional filtering and pagination.
 * 
 * @route GET /todo?limit=10?page=1?status=completed?search=submit
 * @param {Object} req.query - Query parameters for filtering and pagination
 * @param {number} [req.query.limit=10] - Number of todos per page
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {string} [req.query.status] - Filter todos by status ('completed' or 'pending')
 * @param {string} [req.query.search] - Search term to filter todos by title or description
 * @returns {Object} JSON response with todo list, pagination details, and total count
 */
export const getTodoList = async (req: Request, res: Response): Promise<void> => {
   try {
      const { status, limit = 10, page = 1, search } = req.query;

      const query: any = { user: req?.user?.id };

      // status filter
      if (status) {
         if (status === 'completed') {
            query.completed = true;
         } else if (status === 'pending') {
            query.completed = false;
         }
      }

      // search filter
      if (search) {
         query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
         ];
      }

      // Convert page & limit to numbers and calculate skip
      const pageNumber = Math.max(1, parseInt(page as string));
      const limitNumber = Math.max(1, parseInt(limit as string));
      const skip = (pageNumber - 1) * limitNumber;

      // Fetch total count
      const total = await Todo.countDocuments(query);

      // Fetch results
      const todos = await Todo.find(query)
         .skip(skip)
         .limit(limitNumber)
         .sort({ dueDate: 1 });

      res.status(200).json({
         message: "Todo list fetched successfully.",
         page: pageNumber,
         limit: limitNumber,
         total,
         data: todos
      });
   } catch (error) {
      handleError(res, error);
   }
};


/**
 * Retrieves a specific todo by its ID for the authenticated user.
 * 
 * @route GET /todo/:id
 * @param {Request} req - Express request object containing todo ID in params
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns the todo item or a 404 error if not found
 */
export const getTodoById = async (req: any, res: any): Promise<void> => {
   try {

      // Check todo exists for logged in user
      const todo = await Todo.findOne({
         _id: new mongoose.Types.ObjectId(req.params.id),
         user: new mongoose.Types.ObjectId(req.user.id)
      });
      if (!todo) {
         return res.status(404).json({ message: 'Todo not found' });
      }

      return res.status(200).json({
         message: 'Todo fetched successfully',
         data: todo,
      });
   } catch (error) {
      return handleError(res, error);
   }
};


/**
 * Updates a specific todo by its ID for the authenticated user.
 * 
 * @route PUT /todo/:id
 * @param {Request} req - Express request object containing todo ID in params and updated todo data in body
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns the updated todo or a 404 error if todo not found
 */
export const updateTodo = async (req: any, res: any): Promise<void> => {
   try {
      // Find & update
      const todo = await Todo.findOneAndUpdate(
         { _id: req.params.id, user: req.user.id },
         req.body,
         { new: true }
      );
      if (!todo) {
         return res.status(404).json({ message: 'Todo not found' })
      };

      return res.status(200).json({
         message: 'Todo updated successfully',
         data: todo,
      });
   } catch (error) {
      return handleError(res, error);
   }
};


/**
 * Deletes a specific todo by its ID for the authenticated user.
 * 
 * @route DELETE /todo/:id
 * @param {Request} req - Express request object containing todo ID in params
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns a success message or a 404 error if todo not found
 */
export const deleteTodo = async (req: any, res: any): Promise<void> => {
   try {
      // Find & delete
      const todo = await Todo.findOneAndDelete({
         _id: req.params.id,
         user: req.user.id
      });
      if (!todo) {
         return res.status(404).json({ message: 'Todo not found' });
      }

      res.status(200).json({ message: 'Todo deleted successfully' });

   } catch (error) {
      return handleError(res, error);
   }
};
