App supports following commands:
**add** - adds habit to DB, requires following flags:
--name (required) - name of the habit  
--freq (required) - frequency required for habit execution (daily|weekly|monthly)  
example:  
`npm run add -- --name Test --freq daily`  
  
**list** - lists all habits from DB  
example:  
`npm run list`  

**done** - marks habit execution, require following flags:  
--id (required) - ID of the habit that has been executed  
--daysPast (optional) - number of days past since execution (in case if user forgot to mark it on time)  
examples:  
    `npm run done -- --id 1`  
    `npm run done -- --id 1 --daysPast 1`  

**history** - lists history of habit executions
example:
    `npm run history`
**stats** - lists habit progression on provided date, accepts following flags  
--date (optional) - date in yyyy-mm-dd format for which statistics will be calculated  
examples:  
`npm run stats`  
`npm run stats -- --date 2025-06-18`  

**delete** - remove habit form DB and its executions from executions DB, requires following flags:  
--id (required) - ID of the habit that will be removed
example:  
`npm run delete -- --id 1`

**update** - updates habit name or frequency, requires following flags:  
--id (required) - ID of the habit to update  
--name (optional) - new habit name   
--freq (optional) - new habit frequency (daily|weekly|monthly)    
Note: command requires to provide name, freq or both
examples:  
`npm run update -- --id 1 --name Updated`  
`npm run update -- --id 1 --freq weekly`  
`npm run update -- --id 1 --name Updated --freq weekly`  


For fast filling DB for testing you can use `test:migration` script. Data that will be added is stored in `./testData/testData.js`