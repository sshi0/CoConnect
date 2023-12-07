// Extracts all the secrets and environment variables from the .env file

import dotenv from 'dotenv';

dotenv.config();

export const PORT: number = process.env.PORT ? Number(process.env.PORT) : 3000; // defaults to 3000

export const ENV : string = process.env.ENV ?? 'DEV';

export const DB_CONN_STR: string =
  ENV === 'DEV'
    ? process.env.DB_URL_DEV as string
    : ENV === 'PROD'
    ? process.env.DB_URL_PROD as string
    : 'unknown';

export const JWT_KEY: string = process.env.JWT_KEY ?? 'someDefaultKey';

export const JWT_EXP: string =
  ENV === 'PROD' ? process.env.JWT_EXP ?? '365d' : 'never'; // defaults to never

export const HOST: string =
  ENV === 'DEV' || ENV === 'EARLY'
    ? process.env.DEV_HOST ?? 'unknown'
    : process.env.PROD_HOST ?? 'unknown';
