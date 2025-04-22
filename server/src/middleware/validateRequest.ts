import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.params,"validate")
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        user:req.user
      });

      // Replace the request data with validated data
      req.body = validatedData.body || req.body;
      req.query = validatedData.query || req.query;
      req.params = validatedData.params || req.params;
      req.user = validatedData.user || req.user;

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        console.error('Validation error:', {
          errors: formattedErrors,
          body: req.body,
          query: req.query,
          params: req.params,
        });

        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: formattedErrors,
        });
      }

      console.error('Unexpected validation error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  };
}; 