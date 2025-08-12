import { UsersRepo } from "./src/repositories/users.repo";

const userRepo = new UsersRepo();


const demoFunction = async () => {
    const firstUser = await userRepo.create({
        first_name: 'Test',
        last_name: 'One',
        email: 'test1@example.com',
        role: 'admin'
    });
    console.log('firstUser', firstUser);

    const secondUser = await userRepo.create({
        first_name: 'Second',
        last_name: 'Test',
        email: 'test2@example.com',
        role: 'moderator',
        age: 18
    });
    console.log('secondUser', secondUser);

    const thirdUser = await userRepo.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        role: 'user',
        age: 33
    });
    console.log('thirdUser', thirdUser);

    console.log('find first user', await userRepo.getOne(firstUser.id));

    console.log('update first user', await userRepo.update(firstUser.id,{
        first_name: 'First',
        last_name: 'One',
        age: 32
    }));

    console.log('get all users', await userRepo.getAll());

    console.log('delete second users', await userRepo.delete(secondUser.id));

    console.log('get all users after delete', await userRepo.getAll());
}

(async () => await demoFunction())()