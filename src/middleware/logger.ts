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
 * logger.ts
 */

import config from '../config/config';
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    level: config.node_env === 'production' ? 'info' : 'debug',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
        format.printf(({ timestamp, level, message, stack }) => {
            return `${timestamp} [${level.toUpperCase()}] ${message} ${
                stack ? `\n${stack}` : ''
            }`;
        })
    ),
    transports: [
        new transports.Console({
            stderrLevels: ['error']
        }),
        new transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        new transports.File({ filename: 'logs/combined.log' })
    ]
});
export default logger;