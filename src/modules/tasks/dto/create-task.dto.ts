import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio')
    .max(100, 'El título no puede superar los 100 caracteres'),

  description: z
    .string()
    .max(500, 'La descripción no puede superar los 500 caracteres')
    .optional(),

  status: z.enum(['PENDING', 'IN_PROGRESS', 'DONE']).optional(),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
