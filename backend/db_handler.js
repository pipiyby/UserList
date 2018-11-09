const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect("mongodb://admin:admin123@ds137763.mlab.com:37763/project3");

const employeeSchema = new Schema({
    id: String,
    name: String,
    title: String,
    sex: String,
    start_date: String,
    office_phone: String,
    cell: String,
    sms: String,
    email: String,
    manager: String,
    dr: [String]
});

const relationSchema = new Schema({
    id: String,
    manager: String,
    bosses: [String]
});

const employeeModel = mongoose.model('employee', employeeSchema);
const relModel = mongoose.model('relation', relationSchema, 'relationship');

let getAllEmployee = () => {
    employeeModel.find((err, employees) => {
        if(err){
            return "err";
        } else {
            return employees;
        }
    });
}

let getAllRel = (req, res) => {
    relModel.find((err, relations) => {
        if(err){
            res.json(err);
        } else {
            res.json(relations);
        }
    });
}

let getOneRel = (req, res) => {
    relModel.find({"id": req.params.id}, (err, relation) => {
        if(err){
            res.json(err);
        } else {
            res.json(relation);
        }
    });
}

let insertOneRel = (id, manager, bosses) => {
    let tmp = new relModel({
        id: id,
        manager: manager,
        bosses: bosses
    });
    tmp.save(err => {
        if(err){
            return "err";
        } else {
            return "success";
        }
    });
}

let modifyOneRel = (id, manager, bosses) => {
    relModel.findOne({"id": id}, (err, relation) => {
        if(err){
            return "err";
        } else {
            relation.manager = manager;
            relation.bosses = bosses;
            relation.save(err => {
                if(err){
                    return "err";
                } else {
                    return "success";
                }
            })
        }
    });
}

let getAll = (req, res) => {
    employeeModel.find((err, employees) => {
        if(err){
            res.json(err);
        } else {
            res.json(employees);
        }
    });
}

let getOne = (req, res) => {
    employeeModel.find({"id": req.params.employeeId}, (err, employee) => {
        if(err){
            res.json(err);
        } else {
            res.json(employee);
        }
    })
}

let postOne = (req, res) => {
    let tmp = new employeeModel({
        id: req.body.id,
        name: req.body.name,
        title: req.body.title,
        sex: req.body.sex,
        start_date: req.body.start_date,
        office_phone: req.body.office_phone,
        cell: req.body.cell,
        sms: req.body.sms,
        email: req.body.email,
        manager: req.body.manager,
        dr: []
    });
    tmp.save(err => {
        if(err){
            res.json(err);
        } else {
            employeeModel.update(
                {"id": req.body.manager},
                {$addToSet: {"dr": req.body.id}},
                err => {
                    if(err){
                        res.json(err);
                    } else {
                        relModel.find({"id": req.body.manager}, (err, relation) => {
                            if(err){
                                res.json(err);
                            } else {
                                console.log(JSON.stringify(relation));
                                let tmpRel = (relation.bosses === undefined?
                                new relModel({
                                    id: req.body.id,
                                    manager: req.body.manager,
                                    bosses: [req.body.manager]
                                }):
                                new relModel({
                                    id: req.body.id,
                                    manager: req.body.manager,
                                    bosses: [req.body.manager, ...relation.bosses]
                                }));
                                tmpRel.save(err => {
                                    if(err){
                                        res.json(err);
                                    } else {
                                        getAll(req, res);
                                    }
                                });
                            }
                        });
                    }
                }
            );
        }
    })
}
//To Be Finished
let putOne = (req, res) => {
    //Find self record in employees
    employeeModel.findOne({"id": req.params.employeeId}, (err, employee) => {
        if(err){
            res.json(err);
        } else {
            //Check if relationship needs modification
            if(employee.manager !== req.body.manager){
                let targetBosses = [];
                //Find new manager in relationship collection
                relModel.findOne({"id": req.body.manager}, (err, relation) => {
                    if(err){
                        res.json(err);
                    } else {
                        targetBosses = relation.bosses;
                        //Circle check
                        if(targetBosses.indexOf(req.params.employeeId)!== -1){
                            res.json({operation: true});
                        } else {
                        //No circle, then update old manager info in employees
                        //Remove self from dr array
                        employeeModel.update(
                            {"id": employee.manager},
                            {$pull: {"dr": req.params.employeeId}},
                            err => {
                                if(err){
                                    res.json(err);
                                } else {
                                    //Update new manager info in employees
                                    //Add self to dr array
                                    employeeModel.update(
                                        {"id": req.body.manager},
                                        {$addToSet: {"dr": req.params.employeeId}},
                                        err => {
                                            if(err){
                                                res.json(err);
                                            } else {
                                                //Find new manager in relationship collection
                                                relModel.findOne({"id": req.body.manager}, (err, relation) => {
                                                    if(err){
                                                        res.json(err);
                                                    } else {
                                                        //Find self in relationship collection and update self
                                                        relModel.findOne({"id": req.params.employeeId}, (err, rel) => {
                                                            if(err){
                                                                res.json(err);
                                                            } else {
                                                                console.log(JSON.stringify(relation));
                                                                let tmpbosses = (relation.bosses === undefined? [req.body.manager]:[req.body.manager, ...relation.bosses]);
                                                                let oldbosses = rel.bosses === undefined? ["nothing"]: rel.bosses;
                                                                rel.manager = req.body.manager;
                                                                rel.bosses = tmpbosses;
                                                                rel.save(err => {
                                                                    if(err){
                                                                        res.json(err);
                                                                    } else {
                                                                        //Remove old bosses from xia shu men
                                                                        relModel.updateMany(
                                                                            {"bosses": req.params.employeeId},
                                                                            {$pull: {"bosses": {$in: oldbosses}}},
                                                                            err => {
                                                                                if(err){
                                                                                    res.json(err);
                                                                                } else {
                                                                                    relModel.updateMany(
                                                                                        {"bosses": req.params.employeeId},
                                                                                        {$addToSet: {"bosses": {$each: tmpbosses}}},
                                                                                        err => {
                                                                                            if(err){
                                                                                                res.json(err);
                                                                                            } else {
                                                                                                employee.name = req.body.name;
                                                                                                employee.title = req.body.title;
                                                                                                employee.sex = req.body.sex;
                                                                                                employee.start_date = req.body.start_date;
                                                                                                employee.office_phone = req.body.office_phone;
                                                                                                employee.cell = req.body.cell;
                                                                                                employee.sms = req.body.sms;
                                                                                                employee.email = req.body.email;
                                                                                                employee.manager = req.body.manager;
                                                                                                employee.save(err => {
                                                                                                    if(err){
                                                                                                        res.json(err);
                                                                                                    } else {
                                                                                                        res.json({operation: false});
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        }
                                                                                    );
                                                                                }
                                                                            }
                                                                        );
                                                                    }
                                                                })
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    );
                                }
                            }
                        );}
                    }
                });
            } else {
                getAll(req, res);
            }
        }
    });
}

let deleteOne = (req, res) => {
    employeeModel.findOne({"id": req.params.employeeId}, (err, employee) => {
        if(err){
            res.json(err);
        } else {
            console.log(JSON.stringify(employee));
            relModel.updateMany(
                {"bosses": req.params.employeeId},
                {
                    $pull: {"bosses": req.params.employeeId},
                    $set: {"manager": employee.manager}
                },
                err => {
                    if(err){res.json(err);} 
                    else {
                        relModel.deleteOne({"id": req.params.employeeId}, err => {
                            if(err){res.json(err);} 
                            else {
                                employeeModel.updateMany(
                                    {"manager": req.params.employeeId},
                                    {$set: {"manager": employee.manager}},
                                    err => {
                                        if(err){res.json(err);} 
                                        else {
                                            employeeModel.findOne({"id": employee.manager}, (err, m) => {
                                                if(err){
                                                    res.json(err);
                                                } else {
                                                    m.dr.splice(m.dr.indexOf(req.params.employeeId), 1);
                                                    m.dr.push(...employee.dr);
                                                    m.save(err => {
                                                        if(err){
                                                            res.json(err);
                                                        } else {
                                                            employeeModel.deleteOne({"id": req.params.employeeId}, err => {
                                                                if(err){res.json(err);} 
                                                                else {
                                                                    getAll(req, res);
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                );
                            }
                        });
                    }
                }
            );
        }
    })
}

exports.getAllEmployee = getAllEmployee;
exports.getAll = getAll;
exports.getOne = getOne;
exports.postOne = postOne;
exports.putOne = putOne;
exports.deleteOne = deleteOne;
exports.getAllRel = getAllRel;
exports.getOneRel = getOneRel;