import cron from 'node-cron';
import { Todo } from '../models/todo.model';

/**
 * Initializes and starts the cron job for automatically marking expired todos as completed.
 * This function sets up a daily scheduled task that runs at midnight to update todos
 * that have passed their due date and are not yet marked as completed.
 */
export const startCronJob = () => {

   cron.schedule('0 0 * * *', async () => {
      try {
         const result = await Todo.updateMany(
            {
               dueDate: { $lt: new Date() },
               completed: false,
            },
            { $set: { completed: true } }
         );

         console.log(`[CRON] Marked ${result.modifiedCount} expired todos as completed.`);
      } catch (error) {
         console.error('[CRON] Error marking expired todos:', error);
      }
   });
};


