import { Response } from 'express';

export const handleError = (res: Response, error: any): void => {
   res.status(500).json({
      message: "Internal Server Error",
      error: error?.message || error
   })
};
