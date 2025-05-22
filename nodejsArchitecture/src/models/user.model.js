// Layer for data access
const users = [{ id: 1, name: 'Robot Dreams Student' }, { id: 2, name: 'Robot Dreams Student2' }, { id: 3, name: 'Robot Dreams Student3' }]

export const getUser = function (id) {
    if(!id) {
        return null
    }
    return users.filter(user => user.id == id)[0];
}

export const getAllUsers = function () {
    return users;
}

export const createUser = function (name) {
    const newUser = {
        id: users.length !== 0 ? users[users.length-1].id + 1 : 1,
        name
    }

    users.push(newUser);
    return newUser;
}

export const deleteUser = function (id) {
    const [userToDelete] = users.filter(item => item.id === id);
    if(userToDelete) {
        const userIndex = users.indexOf(userToDelete);
        users.splice(userIndex, 1);
        if(users.filter(item => item.id === id).length !== 0) {
            return deleteUser(id);
        }
        return true;
    } else {
        return false;
    }
}

export const updateUser = function (id, name) {
    const [userToUpdate] = users.filter(item => item.id === id);
    if(userToUpdate) {
        const userIndex = users.indexOf(userToUpdate);
        users[userIndex].name = name;
        return true;
    } else {
        return false;
    }
}