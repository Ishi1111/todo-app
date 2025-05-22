import express from 'express';
import { createTodo, getTodoList, getTodoById, updateTodo, deleteTodo } from '../controllers/todo.controller';
import { handleValidationErrors, validateCreateTodo, validateTodoQuery, validateUpdateTodo } from '../middlewares/todo.middleware';
import { authenticate } from '../utils/jwt';

const router = express.Router();

// authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Todo
 *   description: Todo management
 */

/**
 * @swagger
 * /todo:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - dueDate
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *           example:
 *             title: Submit documents
 *             description: Upload documents to the company portal before the deadline.
 *             dueDate: 2025-06-15
 *     responses:
 *       201:
 *         description: Todo created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', validateCreateTodo, handleValidationErrors, createTodo);

/**
 * @swagger
 * /todo:
 *   get:
 *     summary: Get list of todos
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status (e.g., "completed", "pending")
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title or description
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of todos per page
 *     responses:
 *       200:
 *         description: Todo list fetched successfully
 */
router.get('/', validateTodoQuery, handleValidationErrors, getTodoList);

/**
 * @swagger
 * /todo/{id}:
 *   get:
 *     summary: Get a todo by ID
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 6647aadd2f9b3f23be44e7df
 *         description: The todo ID
 *     responses:
 *       200:
 *         description: Todo found
 *         content:
 *           application/json:
 *             example:
 *               _id: 6647aadd2f9b3f23be44e7df
 *               title: Submit documents
 *               description: Upload documents to the company portal before the deadline.
 *               dueDate: 2025-06-15T00:00:00.000Z
 *               completed: false
 *               user: 663fae819e5f3a5f4d3120ee
 *               createdAt: 2025-05-22T00:05:57.263Z
 *               updatedAt: 2025-05-22T00:05:57.263Z
 *       404:
 *         description: Todo not found
 */
router.get('/:id', getTodoById);


/**
 * @swagger
 * /todo/{id}:
 *   put:
 *     summary: Update a todo by ID
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 6647aadd2f9b3f23be44e7df
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string;
 *               dueDate:
 *                 type: string
 *                 format: date
 *           example:
 *             title: Submit final tax documents
 *             description: Ensure all relevant financial records are included.
 *             dueDate: 2025-06-20
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *       404:
 *         description: Todo not found
 */
router.put('/:id', validateUpdateTodo, handleValidationErrors, updateTodo);

/**
 * @swagger
 * /todo/{id}:
 *   delete:
 *     summary: Delete a todo by ID
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 6647aadd2f9b3f23be44e7df
 *     responses:
 *       200:
 *         description: Todo deleted
 *         content:
 *           application/json:
 *             example:
 *               message: Todo deleted successfully
 *       404:
 *         description: Todo not found
 */
router.delete('/:id', deleteTodo);


export default router;
