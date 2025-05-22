import * as userService from '../services/user.service.js'
import Router from "../helpers/router.js";

const router = new Router();

router.addRoute('GET', '/', (req, res) => {
    const data = userService.getAllUsers();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
});

router.addRoute('GET', '/user', (req, res) => {
    const queryParams = new URLSearchParams(req.url.split( '?' )[1]);
    console.log('get user is triggered', queryParams);
    const data = userService.getUser(queryParams.get('id'));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
});

router.addRoute('POST', '/user', (req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        const userData = JSON.parse(body);
        const newUser = userService.createUser(userData);
        res.writeHead(newUser.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
    });
});

router.addRoute('PUT', '/user', (req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        const userData = JSON.parse(body);
        const updatedUser = userService.updateUser(userData);
        res.writeHead(updatedUser.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedUser));
    });
});

router.addRoute('DELETE', '/user', (req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        const userData = JSON.parse(body);
        const deletedUser = userService.deleteUser(userData);
        res.writeHead(deletedUser.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(deletedUser));
    });
});


export default router;