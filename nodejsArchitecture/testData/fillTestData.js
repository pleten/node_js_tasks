import {habitsToAdd, executionsToAdd} from './testData.js';
import Controller from '../src/controllers/controller.js';

const controller = new Controller();

const fillTestData = async () => {
    for (let i = 0; i < habitsToAdd.length; i++) {
        await controller.handle(habitsToAdd[i]);
    }

    for (let i = 0; i < executionsToAdd.length; i++) {
        await controller.handle(executionsToAdd[i]);
    }
};

(async () => await fillTestData())();
