const users = require('./model');
const jwt = require('jsonwebtoken');
const config = require('./config');

exports.base_endpoint = (req,res) => {
    res.render('index', {message: null});
}

exports.user_signup_get = (req, res, next) => {
    res.render('signup', {message: null});
}
exports.user_signup_post = (req,res,next) => {
    users.findOne({email: req.body.email})
    .then( function(data){
        if(data !== null){
            res.render('message', {
                statusCode: 422,
                success: false,
                error: true,
                message: `You are already registered!`
            });
        }
        else if(!req.body){
            res.render('message', {message: 'name is required'});
        }
        else{
            if(typeof(req.body.firstname)!=='string')
            {
                res.render('message', {statusCode: 422, error: true, message : 'Invalid format'});
            }
            else{
            users.create(req.body).then((data) => {
                if(req.body.admin == null) var identity = 'User';
                else if(req.body.admin == true) var identity = 'Admin';
                res.render('message', {statusCode: 200,
                    error : false,
                    success: false,
                    message: `Your registration was Successful!`,
                    user_id: data._id});               
            }).catch(next)};
        }
    }).catch(next);
}

exports.user_signin_post = (req,res) => {
    const email_addr = req.body.email;
    const password = req.body.password;
    users.findOne({email: email_addr})
    .then(function(data){
        if(data == null){
            res.render('index', {
                statusCode: 404,
                message: `Invalid`
            })
        }
        else if(data.password !== password){
            res.render('index', {
                statusCode: 404,
                message: `Invalid`
            })
        }
        else if(data.status == 'inactive'){
            res.render('message', {
                statusCode : 422,
                error: true,
                message : `Sorry, you have been deactivated`
            })
        }
        else{
            res.render('message', {
                statusCode : 200,
                success : true,
                message : `YOU ARE WELCOME ${data.firstname.toUpperCase()}`
            })
        }
    })
}

exports.authenticate_get = (req,res) => {
    const email_addr = req.query.email;
    users.findOne({email: email_addr})
    .then((data) => {
        if(data == null){
            res.send({
                statusCode: 401,
                success: false,
                response: `Authentication failed. ${email_addr} not found`
            })
        }
        else if(data.admin == false){
            res.send({
                statusCode : 401,
                success : false,
                response : 'Authentication failed. You are not an admin'
            })
        }
        else{
            payload = {email: email_addr};
            const token = jwt.sign(payload, config.secret, {expiresIn: 1440});
            res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token
            });
        }
    })
}      


exports.get_all_users = (req, res) => {
    users.find({}).select({"__v":0})
    .then((users) => {
        res.send(users)
    })
};

exports.get_by_id = (req, res) => {
    users.findById({_id:req.params.id}).select({"__v":0})
    .then(function(data){
        if(data == null){
            res.send({
                statusCode: 404,
                success: false,
                message :`${req.params.id} not found`
            })
        }
        res.send(data)
    })
}

exports.get_by_email= (req, res) => {
    users.findOne({email:req.params.email}).select({"__v":0})
    .then((data) => {
        if(data == null){
            res.send({
                statusCode: 404,
                success: false,
                message :`${req.params.email} not found`
            })
        }
        res.send(data)
    })
}

exports.update_user = (req, res) => {
    var updateObject = req.body; 
    users.findOneAndUpdate({_id  : req.params.id}, {$set: updateObject}).select({'__v': 0})
    .then(function(data){
        if(data == null){
            res.send({
                statusCode: 404,
                success: false,
                message :`${req.params.id} not found`
            })
        }
        else res.send(data);
    })
}

exports.delete_by_id = (req, res) => {
    users.findOne({_id:req.params.id})
    .then((data) => {
        if(data == null ){
            res.send({
                statusCode: 404,
                success : false,
                message: `${req.params.id} does not exist`
            })
        }
        else{
            users.findByIdAndRemove({_id:req.params.id})
            .then(() => {
                res.send({
                    stausCode: 200,
                    success :true,
                    message : `${req.params.id} successfully deleted`
                })
            });
        }
    });
}

exports.update_status = (req,res) => {
    const email_addr = req.params.email;
    const action = req.query.action;
    users.findOne({email: email_addr})
    .then((data) => {
        if(data == null){
            res.send({
                statusCode: 404,
                message: `${email_addr} does not exist`
            })
        }
        else{
            if(data.status == 'active' && action == 'deactivate'){
                users.findOneAndUpdate({email: email_addr}, {$set: {'status' : 'inactive'}}, {new : true}).select({'__v': 0})
                .then((data) => {
                    res.send(data);
                })
            }
            else if(data.status == 'inactive' && action == 'activate'){
                users.findOneAndUpdate({email: email_addr}, {$set: {'status' : 'active'}}, {new : true}).select({'__v': 0})
                .then((data) => {
                    res.send(data);
                })
            }
            else {
                res.send({
                    success :false,
                    statusCode : 422,
                    message: `user is already ${data.status}`
                })              
            }
        }
    })
}