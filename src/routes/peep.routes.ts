
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
import peepController from "../controllers/peep.controller";
import authJwt from '../utility/authJwt';
import express from 'express';

const peepRouter = express();

    peepRouter.use(function(_req: Request, res: Response, next: NextFunction) {
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
    // GET - all peeps
    peepRouter.get(
        "/personal/v1/peeps",
        [authJwt.verifyToken, authJwt.isAdmin],
        peepController.getAllPeeps
    );

    // GET - a peep by id
    peepRouter.get(
        "/personal/v1/peeps/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        peepController.getPeep
    );

    // PUT - update a peep by id
    peepRouter.put(
        "/personal/v1/peeps/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        peepController.updatePeep
    );

    // DELETE - a peep by id
    peepRouter.delete(
        "/personal/v1/peeps/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        peepController.deletePeep
    );

    // DELETE - all peeps
    peepRouter.delete(
        "/personal/v1/peeps",
        [authJwt.verifyToken, authJwt.isAdmin],
        peepController.deleteAllPeeps
    );

    /*
     * ************************************************************************
     * Owner related
     * ************************************************************************
     */

    // GET - all peeps for owner
    peepRouter.get(
        "/personal/v1/owner/peeps",
        [authJwt.verifyToken, authJwt.isOwnerOrAgentOrMonitor],
        peepController.getAllPeepsForOwner
    );

    // GET - peep by id for owner only
    peepRouter.get(
        "/personal/v1/owner/peeps/:id",
        [authJwt.verifyToken, authJwt.isOwnerOrAgentOrMonitor],
        peepController.getPeepForOwner
    );

    // POST - create a new Peep for owner (owner or agent cognizant of userKey)
    peepRouter.post(
        "/personal/v1/owner/peeps",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        peepController.createPeepForOwner
    );

    // PUT - update a peep for owner only
    peepRouter.put(
        "/personal/v1/owner/peeps/:id",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        peepController.updatePeepForOwner
    );

    // DELETE - delete a peep by id for owner only
    peepRouter.delete(
        "/personal/v1/owner/peeps/:id",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        peepController.deletePeepForOwner
    );

    // DELETE - all peeps for owner only
    peepRouter.delete(
        "/personal/v1/owner/peeps",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        peepController.deleteAllPeepsForOwner
    );

export default peepRouter;
