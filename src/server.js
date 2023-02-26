const app = require("./app.js")
const connect = require("./configs/dbs.js")


app.listen(8000, async (req, res)=>{
    await connect()
    console.log("Server is running on port 8000")
})
