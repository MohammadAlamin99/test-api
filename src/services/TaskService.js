const TasksModel = require("../models/TasksModel");

// Create tasks
exports.CreateTask = async (req, res)=>{
    try {
        let reqBody = req.body;
        reqBody.email = req.headers['email'];
        let data = await TasksModel.create(reqBody)
        return({status:"success", data:data});
    } catch (e) {
        return {status:"fail", message:"something went wrong"}
    }
}

// remove task
exports.DeleteTask = async (req, res)=>{
    try {
        let id = req.params.id;
        let matchItemDelete = {_id:id};
        let data = await TasksModel.findByIdAndRemove(matchItemDelete)
        return({status:"success", data:data});

    } catch (e) {
        console.log(e)
        return {status:"fail", message:"something went wrong"}
    }
}


// tasks status update
exports.TaskStatusUpdate = async (req, res)=>{
    try {
        let id= req.params.id;
        let status= req.params.status;
        let Query={_id:id};
        let reqBody = {status:status}
        // id:id filtering status:status set in database
        let data = await TasksModel.updateOne(Query,reqBody)
        return({status:"success", data:data});

    } catch (e) {
        return {status:"fail", message:"something went wrong"}
    }
}


//  select task 
 
exports.ListTaskByStatus = async (req, res)=>{
    try {
        let status = req.params.status;
        let email = req.headers['email'];

        let result = await TasksModel.aggregate([
            
            {$match:{status:status,email:email}},

            {$project:{
                _id:1,title:1,description:1, status:1,
                createdDate:{
                    $dateToString:{
                        date:"$createdDate",
                        format:"%d-%m-%Y"
                    }
                }
            }
        }
        ]); 
        return({status:"success", data:result});

    } catch (e) {
        console.log(e)
        return {status:"fail", message:"something went wrong"}
    }
}


exports.ListTaskCount = async(req, res)=>{
    try {
        let email = req.headers['email'];
        let result = await TasksModel.aggregate([
            {$match:{email:email}},
            {$group:{_id:"$status",total:{$count:{}}}}
        ])
        return({status:"success", data:result});

    } catch (e) {
        console.log(e)
        return {status:"fail", message:"something went wrong"}
    }
    
}