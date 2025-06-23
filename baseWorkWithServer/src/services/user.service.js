const UserModel =  require('../models/user.model');

class UserService {
    constructor() {
    }

    #userRoles = ['user', 'moderator', 'admin'];

    get() {
        const userModel = new UserModel();
        return userModel.get();
    }

    getById(id) {
        const userModel = new UserModel();
        return userModel.getById(+id);
    }

    async create(data) {
        const userModel = new UserModel();
        if(!data) {
            return {
                code: 'EmptyBody',
                error: 'Empty body is not allowed'
            };
        }
        const missingFields = [];
        if(!data.firstName) missingFields.push('firstName');
        if(!data.lastName) missingFields.push('lastName');
        if(!data.email) missingFields.push('email');
        if(!data.role) missingFields.push('role');
        if(missingFields.length > 0 ) {
            return {
                code: 'NoRequiredFields',
                error: `Please provide all required fields. Missing fields: ${missingFields.join(', ')}`
            };
        }
        if(!this.#userRoles.includes(data.role)) {
            return {
                code: 'InvalidData',
                error: `Unsupported role. Please provide one of the following: ${this.#userRoles.join(', ')}`
            };
        }
        const createResp = await userModel.create(data);
        if(createResp === null) {
            return { code: 'UnexpectedError', error: 'Oops! Something wrong.' };
        }
        return { code: 'OK', user: createResp };
    }

    async delete(id) {
        const userModel = new UserModel();
        const deleteResponse = await userModel.delete(+id);
        if(deleteResponse === null) {
            return { code: 'UnexpectedError', error: 'Oops! Something wrong.' };
        }
        if(!deleteResponse) {
            return { code: 'NotFound', error: 'User not found' };
        }
        return { code: 'NoContent', message: 'User has been deleted' };
    }

    async update(id, data) {
        const userModel = new UserModel();
        if(!data) {
            return {
                code: 'EmptyBody',
                error: 'Empty body is not allowed'
            };
        }
        const validFields = ['firstName', 'lastName', 'email', 'role'];
        if(!Object.keys(data).some(key => validFields.includes(key))) {
            return {
                code: 'NoRequiredFields',
                error: `Please provide at least one of the following fields: ${validFields.join(', ')}`
            };
        }
        const updateResponse = await userModel.update(+id, data);
        if(updateResponse === null) {
            return { code: 'UnexpectedError', error: 'Oops! Something wrong.' };
        }
        if(!updateResponse) {
            return { code: 'NotFound', error: 'User not found' };
        }
        return { code: 'OK', message: 'User has been updated' };
    }
}

module.exports = UserService;