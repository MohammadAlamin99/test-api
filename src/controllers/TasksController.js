
const { CreateTask, DeleteTask, TaskStatusUpdate, ListTaskByStatus, ListTaskCount } = require("../services/TaskService");

exports.createTask = async (req, res) => {
    let result = await CreateTask(req);
    return res.status(200).json(result);
}


exports.deleteTask = async (req, res) => {
    let result = await DeleteTask(req);
    return res.status(200).json(result);
 }



exports.updateStatus = async (req, res) => {
    let result = await TaskStatusUpdate(req);
    return res.status(200).json(result);
 }

//  select status by status
exports.listByStatus = async (req, res) => {
    let result = await ListTaskByStatus(req);
    return res.status(200).json(result);
 }

//  status counting
exports.listTaskCount = async (req, res) => {
    let result = await ListTaskCount(req);
    return res.status(200).json(result);
 }