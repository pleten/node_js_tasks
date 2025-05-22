// Business logic
import * as userModel from '../models/user.model.js';

export const getAllUsers = function () {
    const users = userModel.getAllUsers();
    return {
        users,
        time: new Date().toISOString()
    };
}

export const getUser = function (id) {
    const user = userModel.getUser(id);
    if(!user) {
        return {
            status: 404,
            message: `There is no such user!`,
            time: new Date().toISOString()
        }
    }
    return {
        status: 200,
        message: `Hello, ${user.name}!`,
        time: new Date().toISOString()
    };
}

export const createUser = function (data) {
    if(!data.name) {
        return {
            status: 400,
            message: `User name is required!`,
            time: new Date().toISOString()
        }
    }
    const user = userModel.createUser(data.name);
    return {
        status: 201,
        message: `User ${user.name} has been created!`,
        time: new Date().toISOString()
    }
}

export const updateUser = function (data) {
    if(!data.id || !data.name) {
        const missingFields = [];
        if(!data.id) missingFields.push('id');
        if(!data.name) missingFields.push('name');
        return {
            status: 400,
            message: `Following required fields are missing: ${missingFields.join(', ')}!`,
            time: new Date().toISOString()
        }
    }
    const updateResult = userModel.updateUser(data.id, data.name);
    if(!updateResult) {
        return {
            status: 404,
            message: `There is no such user!`,
            time: new Date().toISOString()
        }
    } else {
        return {
            status: 200,
            message: `User has been successfully updated!`,
            time: new Date().toISOString()
        }
    }
}

export const deleteUser = function (data) {
    if(!data.id) {
        return {
            status: 400,
            message: `User id is required!`,
            time: new Date().toISOString()
        }
    }
    if(userModel.deleteUser(data.id)) {
        return {
            status: 200,
            message: `User has been successfully deleted!`,
            time: new Date().toISOString()
        }
    } else {
        return {
            status: 404,
            message: `There is no such user!`,
            time: new Date().toISOString()
        }
    }
}