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
 */

import db from "../models";
import { NextFunction, Request, Response } from "express";

const Member = db.member;

const checkDuplicateEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // other nonsense
        const pi = req.query["pi"];
        if (!pi) {
            return res.status(400).send({
                message: "Failed! You blew the secret handshake!",
            });
        }

        // Member
        let member = await Member.findOne({
            where: {
                email: req.body.email,
            },
        });

        if (member) {
            return res.status(400).send({
                message: "Failed! Email is already subscribed!",
            });
        }

        next();
    } catch (error) {
        return res.status(500).send({
            message: "Internal server error",
        });
    }
};

const verifySignUp = {
    checkDuplicateEmail,
};

export default verifySignUp;
