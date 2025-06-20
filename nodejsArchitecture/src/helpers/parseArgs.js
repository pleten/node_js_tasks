export const parseArgs = (argsArray) => {
    const parsedArgs = {
        params: {
        },
        command: argsArray[2]
    };
    const params = argsArray.slice(3);
    for(let i = 0; i < params.length; i+=2) {
        if(params[i].includes('--') && params[i+1] !== undefined && !params[i+1].includes('--')) {
            parsedArgs.params[params[i].replace('--', '')] = params[i+1];
        } else {
            return parsedArgs.error = 'Parameters are invalid!';
        }
    }

    return parsedArgs;
};