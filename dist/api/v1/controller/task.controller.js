"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.edit = exports.create = exports.changeMultiStatus = exports.changeStatus = exports.detail = exports.index = void 0;
const task_model_1 = __importDefault(require("../models/task.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        deleted: false
    };
    if (req.query.status) {
        find.status = req.query.status;
    }
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    let pagination = {
        current: 1,
        limitPage: 2
    };
    if (req.query.page) {
        pagination.current = parseInt(req.query.page);
        pagination.limitPage = parseInt(req.query.limit) || 4;
    }
    pagination.skip = (pagination.current - 1) * pagination.limitPage;
    let count = yield task_model_1.default.countDocuments(find);
    const total = Math.ceil(count / pagination.limitPage);
    pagination.page = total;
    if (req.query.search) {
        find.title = new RegExp(req.query.search, 'i');
    }
    const tasks = yield task_model_1.default.find(find).sort(sort).limit(pagination.limitPage).skip(pagination.skip);
    res.json(tasks);
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const task = yield task_model_1.default.findOne({ _id: id, deleted: false });
        res.json(task);
    }
    catch (error) {
        res.json({ message: 'Task not found' });
    }
});
exports.detail = detail;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const status = req.body.status;
        yield task_model_1.default.updateOne({ _id: id }, { status: status });
        res.json({ message: 'Change status success', code: 200 });
    }
    catch (error) {
        res.json({ message: 'Task not found' });
    }
});
exports.changeStatus = changeStatus;
const changeMultiStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids, key, value } = req.body;
        switch (key) {
            case 'status':
                yield task_model_1.default.updateMany({ _id: { $in: ids } }, { status: value });
                res.json({ message: 'Change status success', code: 200 });
                break;
            case 'deleted':
                yield task_model_1.default.updateMany({ _id: { $in: ids } }, { deleted: true });
                res.json({ message: 'Change deleted success', code: 200 });
                break;
            default:
                break;
        }
    }
    catch (error) {
        res.json({ message: 'Task not found' });
    }
});
exports.changeMultiStatus = changeMultiStatus;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield task_model_1.default.create(req.body);
        res.json(task);
    }
    catch (error) {
        res.status(400).json({
            message: "Create task failed",
            error: error.message
        });
    }
});
exports.create = create;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const task = yield task_model_1.default.findByIdAndUpdate(id, req.body);
        res.json(task);
    }
    catch (error) {
        res.status(400).json({ message: "Edit task failed", error: error.message });
    }
});
exports.edit = edit;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield task_model_1.default.updateOne({ _id: id }, { deleted: true });
        res.json({ message: 'Delete task success', code: 200 });
    }
    catch (error) {
        res.status(400).json({ message: "Delete task failed", error: error.message });
    }
});
exports.deleteTask = deleteTask;
