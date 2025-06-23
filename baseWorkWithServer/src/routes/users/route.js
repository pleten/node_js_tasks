const {json} = require('../../lib/json');
const UserController = require('../../controllers/user.controller');
const userController = new UserController();

module.exports = {
    handler: (req, res) => {
        switch (req.method) {
            case 'GET':
                return userController.get(req, res);
            case 'POST':
                return userController.create(req, res);
            default:
                return json(res, 405,{ error: 'Method Not Allowed' });
        }
    }
};
