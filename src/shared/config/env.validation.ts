import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  APP_PORT: Joi.number().port().default(3001),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().min(8).required(),
  JWT_REFRESH_SECRET: Joi.string().min(8).required(),

  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_PORT: Joi.number().port().default(5432),

  PG_ADMIN_PORT: Joi.number().port().default(80),
  PGADMIN_DEFAULT_EMAIL: Joi.string().email().required(),
  PGADMIN_DEFAULT_PASSWORD: Joi.string().required(),

  MINIO_PORT: Joi.number().port().default(9000),
  MINIO_CONSOLE_PORT: Joi.number().port().default(9001),
  MINIO_ROOT_USER: Joi.string().required(),
  MINIO_ROOT_PASSWORD: Joi.string().required(),

  S3_ENDPOINT: Joi.string().uri().required(),
  S3_ACCESS_KEY: Joi.string().required(),
  S3_SECRET_KEY: Joi.string().required(),
  S3_BUCKET: Joi.string().required(),
  S3_REGION: Joi.string().required(),

  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_HOST: Joi.string().hostname().required(),

  MAX_IP_REQUEST: Joi.number().integer().positive().default(5),
  IP_REQUEST_TTL: Joi.number().integer().positive().default(6000),
});
