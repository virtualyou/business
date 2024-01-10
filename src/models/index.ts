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
 * index.ts
 */

import config from "../config/config";
import { Sequelize } from "sequelize-typescript";
import Member from "./member.model";

const sequelize = new Sequelize(
    config.database.db,
    config.database.user,
    config.database.password,
    {
        logging: false,
        host: config.database.host,
        dialect: config.database.dialect,
        pool: {
            max: config.database.pool.max,
            min: config.database.pool.min,
            acquire: config.database.pool.acquire,
            idle: config.database.pool.idle,
        },
    }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db: any = {};

db["sequelize"] = sequelize;
db["Sequelize"] = Sequelize;

db.member = Member(sequelize, Sequelize);

export default db;
