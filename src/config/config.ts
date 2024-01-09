/*
 *
 * VirtualYou Project
 * Copyright 2023 David L Whitehurst
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * config.ts
 */

import * as dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({
    path: path.resolve(__dirname, '../../.env')
});

const envSchema = Joi.object().keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.string().required().default('3002'),
    DB_HOST: Joi.string().required().default('localhost'),
    DB_USER: Joi.string().required().default('root'),
    DB_PASSWORD: Joi.string().required().default('mariadbAdmin123'),
    DB_SCHEMA: Joi.string().required().default('virtualyou')
});

const { value: validatedEnv, error } = envSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env, { abortEarly: false, stripUnknown: true });

if (error) {
    throw new Error(
        `Environment variable validation error: \n${error.details
            .map((detail) => detail.message)
            .join('\n')}`
    );
}

const config = {
    node_env: validatedEnv.NODE_ENV,
    server: {
        port: validatedEnv.PORT,
        url: validatedEnv.SERVER_URL
    },
    database: {
        host: validatedEnv.DB_HOST,
        user: validatedEnv.DB_USER,
        password: validatedEnv.DB_PASSWORD,
        db: validatedEnv.DB_SCHEMA,
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
} as const;

export default config;