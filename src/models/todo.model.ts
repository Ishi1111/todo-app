import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
   {
      title: { type: String, required: true },
      description: { type: String },
      dueDate: { type: Date, required: true, index: true },
      completed: { type: Boolean, default: false, index: true },
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
         index: true
      },
   },
   { timestamps: true }
);

export const Todo = mongoose.model('Todo', todoSchema);
