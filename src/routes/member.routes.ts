
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

import {NextFunction, Request, Response} from "express";
import memberController from "../controllers/member.controller";
import authJwt from '../utility/authJwt';
import express from 'express';
import verifySignUp from "../utility/verifySignUp";

const memberRouter = express();

    memberRouter.use(function(_req: Request, res: Response, next: NextFunction) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

/*
 * ************************************************************************
 * WARNING: Admin only
 * ************************************************************************
 */
    // GET - all members
    memberRouter.get(
        "/business/v1/members",
        [authJwt.verifyToken, authJwt.isAdmin],
        memberController.getAllMembers
    );

    // GET - a member by id
    memberRouter.get(
        "/business/v1/members/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        memberController.getMember
    );

    // POST - a new member
    memberRouter.post(
    "/business/v1/members",
    [authJwt.verifyToken, authJwt.isAdmin, verifySignUp.checkDuplicateEmail],
    memberController.createMember
);
    // PUT - update a member by id
    memberRouter.put(
        "/business/v1/members/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        memberController.updateMember
    );

    // DELETE - a member by id
    memberRouter.delete(
        "/business/v1/members/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        memberController.deleteMember
    );

    /*
    UNIMPLEMENTED DUE TO RISK OF LOSS OF ALL MEMBERS
    // DELETE - all members
    memberRouter.delete(
        "/business/v1/members",
        [authJwt.verifyToken, authJwt.isAdmin],
        memberController.deleteAllMembers
    );
    */


export default memberRouter;
