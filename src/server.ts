import app from "./app"
import {connectToDatabase} from "./config/database"
import {env} from "./config/env"


async function start(){
    await connectToDatabase()
    app.listen(env.PORT , ()=> {
        console.log(`Server is running on ${env.PORT} PORT :)`);
    })
}


start()