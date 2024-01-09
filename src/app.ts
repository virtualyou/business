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
 * app.ts
 */

import express, {type Express} from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import db from "./models/index";
import peepRouter from "./routes/peep.routes";
import cookieSession from "cookie-session";
import * as process from "process";

const initIndex = process.argv.indexOf("--init=true");
const init = initIndex !== -1;

const app: Express = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
    cookieSession({
        name: "virtualyou-session",
        keys: ["COOKIE_SECRET"],
        //domain: '.virtualyou.info',
        httpOnly: true,
        sameSite: 'strict'
    })
);

app.use(function (_req, res, next) {
    res.setTimeout(120000, function () {
        console.log('Request has timed out.');
        res.send(408);
    });
    next();
});

app.get("/", (_req, res) => {
    res.send("Welcome to the VirtualYou Personal API.");
});

// database
const Peep = db.peep;

if (init) {
    db.sequelize.sync({force: true}).then(() => {
        console.log("Drop and Resync Db");
        initial();
    });
} else {
    db.sequelize.sync();
}

// routes
app.use(peepRouter);

// create reference role objects
function initial() {
    Peep.create({
        name: "David Knoxville",
        userKey: 1,
        phone1: "919-888-3000",
        phone2: "",
        email: "me@dlwhitehurst.com",
        address: "123 Anywhere Ln, Sampleville, ND, 23045",
        note: "Insurance Agent"
    });

    Peep.create({
        name: "Patty Brown",
        userKey: 1,
        phone1: "722-310-1288",
        phone2: "",
        email: "pbrown@schwartz.com",
        address: "4922 Clamstrip St, Middlebury, CT, 29300",
        note: "Good friend"
    });

    Peep.create({
        name: "Nancy Reynolds",
        userKey: 1,
        phone1: "800-825-9274",
        phone2: "",
        email: "nrey@acme.com",
        address: "",
        note: "Nurse"
    });

    Peep.create({
        name: "Peggy Smith",
        userKey: 1,
        phone1: "892-123-7702",
        phone2: "",
        email: "psmith@yahoo.com",
        address: "3456 Jaybird Ct, Gloucester Pt. VA, 23062",
        note: "Mother in Law"
    });

    Peep.create({
        name: "Robert Sandberg",
        userKey: 1,
        phone1: "877-655-2309",
        phone2: "",
        email: "rsandberg@gmail.com",
        address: "",
        note: "Jeweler"
    });
}

export default app;
