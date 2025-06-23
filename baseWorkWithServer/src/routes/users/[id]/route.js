const {json} = require('../../../lib/json');
const UserController = require('../../../controllers/user.controller');
const userController = new UserController();

module.exports = {
    handler: (req, res, params) => {
        switch (req.method) {
            case 'GET':
                return userController.getById(req, res, params);
            case 'PUT':
                return userController.update(req, res, params);
            case 'DELETE':
                return userController.delete(req, res, params);
            default:
                return json(res, 405,{ error: 'Method Not Allowed' });
        }
    }
};
