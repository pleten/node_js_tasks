import HabitModel from '../models/habit.model.js';
import ExecutionModel from '../models/execution.model.js';
import {getWeek} from '../helpers/dateWeek.js';

class Service {
    constructor() {
    }

    async add(data) {
        const validFrequencies = ['daily', 'weekly', 'monthly'];
        if(!data.freq || !data.name) {
            const missingFields = [];
            if(!data.name) missingFields.push('name');
            if(!data.freq) missingFields.push('freq');
            return {
                error: `Following required fields are missing: ${missingFields.join(', ')}!`,
            };
        }
        if(!validFrequencies.includes(data.freq)) {
            return {
                error: `Invalid frequency! Provide one of the following: ${validFrequencies.join(', ')}!`,
            };
        }
        const habitModel = new HabitModel();
        if(await habitModel.add(data.name, data.freq)) {
            return {
                message: `Habit "${data.name}" has been added to the list.`
            };
        } else {
            return {
                error: 'Oops! Something went wrong.'
            };
        }
    }

    async list() {
        const habitModel = new HabitModel();
        const habits = await habitModel.list();
        if(habits.length > 0) {
            const messageArray = habits.map(habit => ` ${habit.id} | ${habit.name} | ${habit.freq} |`);
            messageArray.unshift(' ID |   Name   | Frequency |');
            return {
                message: messageArray.join('\n')
            };
        } else {
            return {
                message: 'There is no habits yet.'
            };
        }
    }

    async done(data) {
        const id  = parseInt(data.id);
        const daysPast = data.daysPast || 0;
        const habitModel = new HabitModel();
        const executionModel = new ExecutionModel();
        if(await habitModel.exist(id)) {
            return (await executionModel.done(id, daysPast)) ? {
                message: 'Habit execution has been recorded'
            } : {
                error: 'Habit execution recording failed.'
            };
        } else {
            return {
                error: `Habit with id ${id} does not exist.`
            };
        }
    }

    async history() {
        const executionModel = new ExecutionModel();
        const executions = await executionModel.stats();
        const habitModel = new HabitModel();
        const habits = await habitModel.list();
        if(executions.length > 0) {
            const messageArray = executions.sort((a,b) => {
                if(a.date > b.date ) {
                    return 1;
                }
                if(a.date > b.date ) {
                    return -1;
                }
                return 0;
            }).map(execution => ` ${new Date(execution.date).toDateString()} | ${execution.id} | ${habits.filter(item => item.id === execution.id)[0].name} |`);
            messageArray.unshift('       Date      | ID |     Name     |');
            return {
                message: messageArray.join('\n')
            };
        } else {
            return {
                message: 'There is no statistics yet.'
            };
        }
    }

    async stats(params) {
        const dateToCheck = !params.date ? new Date() : new Date(params.date);
        const executionModel = new ExecutionModel();
        const executions = await executionModel.stats();
        const habitModel = new HabitModel();
        const habits = await habitModel.list();
        if(executions.length > 0) {
            const sortedExecutions = executions.sort((a,b) => {
                if(a.date > b.date ) {
                    return 1;
                }
                if(a.date > b.date ) {
                    return -1;
                }
                return 0;
            });
            const messageArray = habits.map(habit => {
                let habitCompleted = 'No';
                const habitExecutions = sortedExecutions.filter( exec => exec.id === habit.id);
                const latestCompletionDate = new Date(habitExecutions[habitExecutions.length-1].date);

                if(habit.freq === 'daily') {
                    habitCompleted = latestCompletionDate.getDate() === dateToCheck.getDate() ? 'Yes' : 'No';
                }
                if(habit.freq === 'weekly') {
                    habitCompleted = getWeek(latestCompletionDate) === getWeek(dateToCheck) ? 'Yes' : 'No';
                }
                if(habit.freq === 'monthly') {
                    habitCompleted = latestCompletionDate.getMonth() === dateToCheck.getMonth() ? 'Yes' : 'No';
                }

                return ` ${habit.id} | ${habit.name} |   ${habitCompleted}   |`;
            });
            messageArray.unshift(' ID |     Name     | Completed |');
            messageArray.unshift(`Statistics for date ${dateToCheck.toDateString()}:`);
            return {
                message: messageArray.join('\n')
            };
        } else {
            return {
                message: 'There is no statistics yet.'
            };
        }
    }

    async delete(params) {
        const executionModel = new ExecutionModel();
        const habitModel = new HabitModel();
        if(!params.id) {
            return {
                error: 'Please provide habit ID.'
            };
        } else {
            await habitModel.delete(params.id);
            await executionModel.delete(params.id);
            return {
                message: 'Habit and it`s execution records have been deleted.'
            };
        }
    }

    async update(params) {
        const habitModel = new HabitModel();
        if(!params.id) {
            return {
                error: 'Please provide habit ID.'
            };
        } else {
            const response = await habitModel.update(params.id, {
                name: params.name || null,
                freq: params.freq || null
            });
            if(response) {
                return {
                    message: 'Habit has been updated.'
                };
            } else {
                return {
                    error: 'There is no habit with such ID.'
                };
            }
        }
    }
}

export default Service;