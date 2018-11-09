const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect("mongodb://admin:admin123@ds245523.mlab.com:45523/p3");

const employeeSchema = new Schema({
    avatar: String,
    name: String,
    title: String,
    sex: String,
    start_date: String,
    office_phone: String,
    cell: String,
    sms: String,
    email: String,
    manager: {type: Schema.Types.ObjectId, ref: 'Employee'},
    dr: [{type: Schema.Types.ObjectId, ref: 'Employee'}],
    bosses: [{type: Schema.Types.ObjectId, ref: 'Employee'}],
});

const employeeModel = mongoose.model('Employee', employeeSchema, 'employees');

let getAll = (req, res) => {
    employeeModel.find().populate('manager', 'name')
    .then(employees => {
        res.json(employees);
    }).catch(err => {
        res.json(err);
    });
};

let getOne = (req, res) => {
    employeeModel.find({"_id": req.params.employeeId}).populate('manager', 'name')
    .then(employee => {
        res.json(employee);
    }).catch(err => {
        res.json(err);
    });
};

let postOne = (req, res) => {
    if(req.body.manager !== ""){
        console.log(req.body);
        employeeModel.findOne({"_id": req.body.manager})
        .then(manager => {
            tmpManager = manager;
            let tmp = new employeeModel({
                avatar: req.body.avatar,
                name: req.body.name,
                title: req.body.title,
                sex: req.body.sex,
                start_date: req.body.start_date,
                office_phone: req.body.office_phone,
                cell: req.body.cell,
                sms: req.body.sms,
                email: req.body.email,
                manager: req.body.manager,
                dr: [],
                bosses: manager.bosses === undefined? [req.body.manager]:[req.body.manager, ...manager.bosses]
            });
            return tmp.save();
        }).then(employee => {
            console.log(employee._id);
            return employeeModel.update({"_id": req.body.manager},{$addToSet: {"dr": employee._id}});
        }).then(() => {
            res.json({message: "Succeed"});
        }).catch(err => {
            res.json(err);
        });
    } else {
        let tmp = new employeeModel({
            avatar: req.body.avatar,
            name: req.body.name,
            title: req.body.title,
            sex: req.body.sex,
            start_date: req.body.start_date,
            office_phone: req.body.office_phone,
            cell: req.body.cell,
            sms: req.body.sms,
            email: req.body.email,
            manager: null,
            dr: [],
            bosses: []
        });
        tmp.save().then(() => {
            res.json({message: "Succeed"});
        }).catch(err => {
            res.json(err);
        });
    }
};

let deleteOne = (req, res) => {
    employeeModel.findOne({"_id": req.params.employeeId})
    .then(employee => {
        console.log(employee.dr.length);
        if(employee.dr.length !== 0 && employee.manager !== null){
            console.log(employee.manager);
            employeeModel.updateMany(
                {"manager": req.params.employeeId}, 
                {$set: {"manager": employee.manager}}
            ).then(() => {
                return employeeModel.updateMany(
                    {"bosses": req.params.employeeId},
                    {$pull: {"bosses": req.params.employeeId}}
                );
            }).then(() => {
                return employeeModel.findOne({"_id": employee.manager});
            }).then(m => {
                m.dr.splice(m.dr.indexOf(req.params.employeeId), 1);
                m.dr.push(...employee.dr);
                return m.save();
            }).then(() => {
                employeeModel.deleteOne({"_id": req.params.employeeId})
                .then(() => {
                    getAll(req, res);
                }).catch(err => {
                    res.json(err);
                });
            }).catch(err => {
                res.json(err);
            });
        } else if(employee.manager !== null && employee.dr.length === 0){
            console.log("type2");
            employeeModel.findOne({"_id": employee.manager})
            .then(m => {
                m.dr.splice(m.dr.indexOf(req.params.employeeId), 1);
                m.dr.push(...employee.dr);
                return m.save();
            }).then(() => {
                employeeModel.deleteOne({"_id": req.params.employeeId})
                .then(() => {
                    getAll(req, res);
                }).catch(err => {
                    res.json(err);
                });
            }).catch(err => {
                res.json(err);
            });
        } else if(employee.dr.length !== 0 && employee.manager === null){
            console.log("type3");
            employeeModel.updateMany(
                {"manager": req.params.employeeId}, 
                {$set: {"manager": null}}
            ).then(() => {
                return employeeModel.updateMany(
                    {"bosses": req.params.employeeId},
                    {$pull: {"bosses": req.params.employeeId}}
                );
            }).then(() => {
                employeeModel.deleteOne({"_id": req.params.employeeId})
                .then(() => {
                    getAll(req, res);
                }).catch(err => {
                    res.json(err);
                });
            }).catch(err => {
                res.json(err);
            });
        } else {
            console.log("type4");
            employeeModel.deleteOne({"_id": req.params.employeeId})
            .then(() => {
                getAll(req, res);
            }).catch(err => {
                res.json(err);
            });
        }
    }).catch(err => {
        res.json(err);
    });
};

let putOne = (req, res) => {
    console.log(req.body);
    let target = {};
    let newBosses = [];
    let oldbosses = [];
    employeeModel.findOne({"_id": req.params.employeeId})
    .then(employee => {
        console.log(employee);
        target = employee;
        if((employee.manager === null && req.body.manager === "") || (employee.manager !== null && employee.manager.toString() === req.body.manager)){
            console.log("No change");
            employee.avatar = req.body.avatar;
            employee.name = req.body.name;
            employee.title = req.body.title;
            employee.sex = req.body.sex;
            employee.start_date = req.body.start_date;
            employee.office_phone = req.body.office_phone;
            employee.cell = req.body.cell;
            employee.sms = req.body.sms;
            employee.email = req.body.email;
            employee.save().then(() => res.json({message: "Succeed"})).catch(err => res.json(err));
        } else{
            console.log("?");
            if(req.body.manager !== "" && employee.manager !== null){
                console.log("Old M + New M");
                //Find new manager
                employeeModel.findOne({"_id": req.body.manager})
                .then(manager => {
                    //Check Circle
                    if(manager.bosses.indexOf(req.params.employeeId)!== -1){
                        res.json({circle: true});
                    } else {
                        newBosses = manager.bosses;
                        //Update new Manager "dr"
                        employeeModel.findOneAndUpdate({"_id": req.body.manager}, {$addToSet: {"dr": req.params.employeeId}})
                        .then(() => {
                            //Update old Manager "dr"
                            return employeeModel.findOneAndUpdate({"_id": target.manager},{$pull: {"dr": req.params.employeeId}});
                        }).then(() => {
                            oldbosses = target.bosses;
                            //Update self
                            target.avatar = req.body.avatar;
                            target.name = req.body.name;
                            target.title = req.body.title;
                            target.sex = req.body.sex;
                            target.start_date = req.body.start_date;
                            target.office_phone = req.body.office_phone;
                            target.cell = req.body.cell;
                            target.sms = req.body.sms;
                            target.email = req.body.email;
                            target.manager = req.body.manager;
                            target.bosses = [req.body.manager, ...newBosses];
                            newBosses = target.bosses;
                            return target.save();
                        }).then(()=> {
                            //Update drs' "bosses"
                            return employeeModel.updateMany({"bosses": req.params.employeeId},{$pull: {"bosses": {$in: oldbosses}}});
                        }).then(() => {
                            return employeeModel.updateMany({"bosses": req.params.employeeId},{$addToSet: {"bosses": {$each: newBosses}}});
                        }).then(() => {
                            res.json({circle: false});
                        }).catch(err => res.json(err));
                    }
                }).catch(err => {
                    res.json(err);
                });
            } else if(req.body.manager !== "" && employee.manager === null){ //No old manager
                console.log("Only new M");
                employeeModel.findOne({"_id": req.body.manager})
                .then(manager => {
                    //Check Circle
                    if(manager.bosses.indexOf(req.params.employeeId)!== -1){
                        res.json({circle: true});
                    } else {
                        newBosses = manager.bosses;
                        //Update new Manager "dr"
                        employeeModel.findOneAndUpdate({"_id": req.body.manager}, {$addToSet: {"dr": req.params.employeeId}})
                        .then(() => {
                            //Update self
                            target.avatar = req.body.avatar;
                            target.name = req.body.name;
                            target.title = req.body.title;
                            target.sex = req.body.sex;
                            target.start_date = req.body.start_date;
                            target.office_phone = req.body.office_phone;
                            target.cell = req.body.cell;
                            target.sms = req.body.sms;
                            target.email = req.body.email;
                            target.manager = req.body.manager;
                            target.bosses = [req.body.manager, ...newBosses];
                            return target.save();
                        }).then(target => {
                            return employeeModel.updateMany({"bosses": req.params.employeeId},{$addToSet: {"bosses": {$each: target.bosses}}});
                        }).then(() => {
                            res.json({circle: false});
                        }).catch(err => res.json(err));
                    }
                }).catch(err => {
                    res.json(err);
                });
            } else if(req.body.manager === "" && employee.manager !== null){ //No new manager
                console.log("Only old M");
                employeeModel.findOneAndUpdate({"_id": target.manager},{$pull: {"dr": req.params.employeeId}})
                .then(() => {
                    oldbosses = target.bosses;
                    //Update self
                    target.avatar = req.body.avatar;
                    target.name = req.body.name;
                    target.title = req.body.title;
                    target.sex = req.body.sex;
                    target.start_date = req.body.start_date;
                    target.office_phone = req.body.office_phone;
                    target.cell = req.body.cell;
                    target.sms = req.body.sms;
                    target.email = req.body.email;
                    target.manager = null;
                    target.bosses = [];
                    return target.save();
                }).then(() => {
                    //Update drs' "bosses"
                    return employeeModel.updateMany({"bosses": req.params.employeeId},{$pull: {"bosses": {$in: oldbosses}}});
                }).then(() => {
                    res.json({message: "Succeed"});
                }).catch(err => res.json(err));
                    
            } else {
                console.log("What");
            }
        }
    }).catch(err => {
        res.json(err);
    });
}

exports.getAll = getAll;
exports.getOne = getOne;
exports.postOne = postOne;
exports.putOne = putOne;
exports.deleteOne = deleteOne;