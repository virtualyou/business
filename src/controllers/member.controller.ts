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
 * member.controller.ts
 */

import {Request, Response} from 'express';
import db from '../models';

const Member = db.member;

class ExpressError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ExpressError';
    }
}

const errorHandler = (err: ExpressError, _req: Request, res: Response) => {
    console.error(err.stack);
    res.status(500).send('Internal server error');
};

const getAllMembers = (req: Request, res: Response) => {
    Member.findAll()
        .then((data: MemberType) => {
            res.send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const getMember = (req: Request, res: Response) => {
    const id = req.params['id'];

    Member.findByPk(id)
        .then((data: MemberType) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Member with id given.`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};


const createMember = (req: Request, res: Response) => {

    // Check request
    if (!req.body.email) {
        res.status(400).send({
            message: "Bad Request, email cannot be empty!"
        });
        return;
    }

    // Create new Member object
    const member = {
        email: req.body.email || ""
    };

    // Create Member using Sequelize
    Member.create(member)
        .then((data: MemberType) => {
            res.status(201).send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const updateMember = (req: Request, res: Response) => {
    const id = req.params['id'];

    Member.update(req.body, {
        where: {
            id: id
        }
    })
        .then((num: number) => {
            if (num == 1) {
                res.send({
                    message: "Member was updated successfully!"
                });
            } else {
                res.status(404).send({
                    message: `Member with id given could not be found!`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const deleteMember = (req: Request, res: Response) => {
    // url parameter
    const id = req.params['id'];

    // delete specific record
    Member.destroy({
        where: {
            id: id
        }
    })
        .then((num: number) => {
            if (num == 1) {
                return res.status(200).send({
                    message: "Member was deleted!"
                });
            } else {
                res.status(404).send({
                    message: `Member was not found!`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

/*
NOT IMPLEMENTED BECAUSE OF RISK TO MEMBER LIST
const deleteAllMembers = (_req: Request, res: Response) => {

    Member.destroy({
        where: {},
        truncate: false
    })
        .then((nums: number) => {
            res.status(200).send({message: `${nums} Members were deleted successfully!`});
        })
        .catch((err: ExpressError) => {
            errorHandler(err, _req, res);
        });
}
*/


const memberController = {
    getAllMembers,
    getMember,
    createMember,
    updateMember,
    deleteMember,
    //deleteAllMembers,
};
export default memberController;
