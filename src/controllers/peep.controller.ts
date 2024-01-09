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
 * peep.controller.ts
 */

import {Request, Response} from 'express';
import db from '../models';

const Peep = db.peep;

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

const getAllPeeps = (req: Request, res: Response) => {
    Peep.findAll()
        .then((data: PeepType) => {
            res.send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const getAllPeepsForOwner = (req: Request, res: Response) => {

    Peep.findAll({
            where: {
                userKey: getWhereKey(req),
            },
        }
    )
        .then((data: PeepType) => {
            res.send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const getPeep = (req: Request, res: Response) => {
    const id = req.params['id'];

    Peep.findByPk(id)
        .then((data: PeepType) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Peep with id=${id}.`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const getPeepForOwner = (req: Request, res: Response) => {
    const id = req.params['id'];

    Peep.findOne({
        where: {
            id: id,
            userKey: getWhereKey(req)
        }
    })
        .then((data: PeepType) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `May not belong to Owner or cannot find this Peep with id=${id}.`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const createPeepForOwner = (req: Request, res: Response) => {

    // Check request
    if (!req.body.name) {
        res.status(400).send({
            message: "Bad Request, name cannot be empty!"
        });
        return;
    }

    // Create new Peep object
    const peep = {
        name: req.body.name,
        phone1: req.body.phone1 || "",
        phone2: req.body.phone2 || "",
        email: req.body.email || "",
        address: req.body.address || "",
        note: req.body.note || "",
        userKey: getWhereKey(req)
    };

    // Create Peep using Sequelize
    Peep.create(peep)
        .then((data: PeepType) => {
            res.status(201).send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const updatePeep = (req: Request, res: Response) => {
    const id = req.params['id'];

    Peep.update(req.body, {
        where: {
            id: id
        }
    })
        .then((num: number) => {
            if (num == 1) {
                res.send({
                    message: "Peep was updated successfully!"
                });
            } else {
                res.status(404).send({
                    message: `Peep with id=${id} could not be found!`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const updatePeepForOwner = (req: Request, res: Response) => {
    const id = req.params['id'];

    Peep.update(req.body, {
        where: {
            id: id,
            userKey: getWhereKey(req)
        }
    })
        .then((num: number) => {
            if (num == 1) {
                res.send({
                    message: "Peep was updated successfully!"
                });
            } else {
                res.status(404).send({
                    message: `Peep with id=${id} may not belong to owner or could not be found!`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};


const deletePeep = (req: Request, res: Response) => {
    // url parameter
    const id = req.params['id'];

    // delete specific record
    Peep.destroy({
        where: {
            id: id
        }
    })
        .then((num: number) => {
            if (num == 1) {
                return res.status(200).send({
                    message: "Peep was deleted!"
                });
            } else {
                res.status(404).send({
                    message: `Peep was not found!`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

const deletePeepForOwner = (req: Request, res: Response) => {
    // url parameter
    const id = req.params['id'];

    // delete specific record
    Peep.destroy({
        where: {
            id: id,
            userKey: getWhereKey(req)
        }
    }).then((num: number) => {
        if (num == 1) {
            return res.status(200).send({
                message: "Peep was deleted!"
            });
        } else {
            res.status(404).send({
                message: `Peep was not found!`
            });
        }
    })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

const deleteAllPeeps = (_req: Request, res: Response) => {

    Peep.destroy({
        where: {},
        truncate: false
    })
        .then((nums: number) => {
            res.status(200).send({message: `${nums} Peeps were deleted successfully!`});
        })
        .catch((err: ExpressError) => {
            errorHandler(err, _req, res);
        });
}

const deleteAllPeepsForOwner = (req: Request, res: Response) => {

    Peep.destroy({
        where: {userKey: getWhereKey(req)},
        truncate: false
    })
        .then((nums: number) => {
            res.status(200).send({message: `${nums} Peeps were deleted successfully!`});
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

const getWhereKey = (req: Request) => {
    let key: number;
    const user: number  =  parseInt(req.userId);
    const owner: number = parseInt(req.ownerId);

    if (owner === 0) {
        key = user;
        console.log("key " + user);
        return key;
    } else {
        key = owner;
        console.log("bastard key " + owner);
        return key;
    }
}

const peepController = {
    getAllPeeps,
    getAllPeepsForOwner,
    getPeep,
    getPeepForOwner,
    createPeepForOwner,
    updatePeep,
    updatePeepForOwner,
    deletePeep,
    deletePeepForOwner,
    deleteAllPeeps,
    deleteAllPeepsForOwner
};
export default peepController;
