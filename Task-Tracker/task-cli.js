    const fs = require('fs')

const args = process.argv.slice(2);

async function addTask(description) {
    fs.readFile('./tasks.json', 'utf8',(error, data) =>{
        tasks = []
        if (error) {
            console.error(error);
            return;
        }
        // pega tudo que já tem no tasks json e guarda numa lista
        if (!error && data){
            tasks = JSON.parse(data)
        }
          
        let newTask = {
            id: tasks.length + 1,
            description: description,
            status: 'todo',
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
        }

        // add nessa lista
        tasks.push(newTask)
        // substitui o json pelo arquivo atualizado
        rewriteTasks(tasks)

    })
}

async function updateTask(id, newDescription) {
    fs.readFile('./tasks.json', 'utf8',(error, data) =>{
        if (error) {
            console.error(error);
            return;
        }

        let tasks = []
        if (!error && data){
            tasks = JSON.parse(data)
        }

        let i = 0

        if (tasks.length == 0){
            console.log(`Does not have tasks yet`);
            return
        }

        while (i < tasks.length){
            if (tasks[i].id == id){
                tasks[i].description = newDescription
                tasks[i].updatedAt = new Date().toString()
                rewriteTasks(tasks)
                break
            }
            i+=1
            if (i == tasks.length){
                console.log(`Task ${id} does not exists`);
            }
        }
    })
    
}

async function deleteTask(id) {
    fs.readFile('./tasks.json', 'utf8',(error, data) =>{
        if (error) {
            console.error(error);
            return;
        }

        let tasks = []
        if (!error && data){
            tasks = JSON.parse(data)
        }

        if (tasks.length == 0){
            console.log(`Does not have tasks yet`);
            return;
        }

        const newTasks = tasks.filter((task) => task.id != id)
        rewriteTasks(newTasks)
        
    })
}


async function statusTask(newStatus, id) {

    fs.readFile('./tasks.json', 'utf8',(error, data) =>{
        if (error) {
            console.error(error);
            return;
        }

        let tasks = []
        if (!error && data){
            tasks = JSON.parse(data)
        }
    let i = 0

    if (tasks.length == 0){
        console.log(`Does not have tasks yet`);
        return
    }

    while (i < tasks.length){
        if (tasks[i].id == id){
            if (newStatus == 'mark-in-progress' ){
                tasks[i].status = "in-progress"
            }
            if (newStatus == 'mark-done' ){
                tasks[i].status = "done"
            }
            tasks[i].updatedAt = new Date().toString()
            rewriteTasks(tasks)
            break
        }
        i+=1
        if (i == tasks.length){
            console.log(`Task ${id} does not exists`);
        }
    }
})
}


async function listTasks(status) {
    fs.readFile('./tasks.json', 'utf8',(error, data) =>{
        if (error) {
            console.error(error);
            return;
        }

        let tasks = []
        if (!error && data){
            tasks = JSON.parse(data)
        }
    let i = 0

    if (tasks.length == 0){
        return []
    }

    while (i < tasks.length){
        if (status == null){
            console.log(tasks[i])
        } else if (status == "done"){
            if (tasks[i].status === 'done'){
                console.log(tasks[i])
            }
        } else if(status == "todo"){
            if (tasks[i].status === 'todo'){
                console.log(tasks[i])
            }
        } else if(status == "in-progress"){
            
            if (tasks[i].status === 'in-progress'){
                console.log(tasks[i])
            }
        }else{
            console.log('[]');
            
        }

        i+=1
    }
})
}


let rewriteTasks = (task) => {
    fs.promises.writeFile('./tasks.json', JSON.stringify(task, null, 2), (error) =>{
        if(error){
            console.log(error);
        }
        else{
            console.log('tarefa adicionada com sucesso');
        }
        })
}


async function verifyExistingData(){
    try{
        await fs.promises.access('./tasks.json')
    }
    catch (error){
        await fs.writeFileSync('./tasks.json', '')
    }
}

async function main(){
    await verifyExistingData()
    if (args[0] === 'add'){
        addTask(args[1])
        
    }
    if (args[0] === 'update'){
        if ((args[1] != null && Number(args[1])) && args[2] != null){
            updateTask(args[1], args[2])
        }else{
            console.log('missing args');
        }
    }
    if (args[0] === 'delete'){
        deleteTask(args[1])
    }
    if (args[0] === 'mark-in-progress'){
        statusTask(args[0], args[1])
    }
    if (args[0] === 'mark-done'){
        statusTask(args[0], args[1])
    }
    if (args[0] === 'list'){
        listTasks(args[1])
    }
}

main()