const UserService = require('../services/user.service');
const {json, bodyJSON} = require('../lib/json');
const statusByCode = require('../lib/errorcodes');
class UserController {
    #userService = new UserService();

    async get(req, res) {
        return json(res, 200, await this.#userService.get());
    }

    async getById(req, res, params) {
        const user = await this.#userService.getById(params[0]);
        if(user.length > 0) {
            return json(res, 200, user);
        } else {
            return json(res, 404, { error: 'User not found'});
        }
    }

    async create(req, res) {
        const createResponse = await this.#userService.create( await bodyJSON(req));
        return json(res, statusByCode[createResponse.code], { ...createResponse });
    }

    async delete(req, res, params) {
        const deleteResponse = await this.#userService.delete(params[0]);
        return json(res, statusByCode[deleteResponse.code], { ...deleteResponse });
    }

    async update(req, res, params) {
        const updateResponse = await this.#userService.update(params[0], await bodyJSON(req));
        return json(res, statusByCode[updateResponse.code], { ...updateResponse });

    }
}

module.exports = UserController;