const fs = require("fs");

module.exports = (client)=>{
    const files = fs.readdirSync("./events").filter(f=>f.endsWith(".js"));
    for(const file of files){
        const event = require(`../events/${file}`);
        if(file.startsWith("clientReady")) client.once("clientReady",(...args)=>event(client,...args));
        else client.on(file.split(".")[0],(...args)=>event(client,...args));
    }
};
