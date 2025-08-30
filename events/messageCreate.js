const fs = require("fs");

module.exports = async(client, message)=>{
    if(message.author.bot || !message.guild) return;

    // Leer prefijo desde memoria o JSON
    let prefixes = client.prefixes;
    if(prefixes.size === 0){
        const filePath = "./data/prefixes.json";
        const data = JSON.parse(fs.readFileSync(filePath,"utf8"));
        for(const guildId in data) prefixes.set(guildId, data[guildId]);
    }

    const config = JSON.parse(fs.readFileSync("./config.json","utf8"));
    const prefix = prefixes.get(message.guild.id) || config.defaultPrefix;

    // Si el bot es mencionado, ejecutar !help
    const mention = `<@${client.user.id}>`;
    if(message.content.startsWith(mention)){
        const helpCmd = client.commands.get("help");
        if(helpCmd) return helpCmd.run(client, message, [], prefix);
    }

    if(!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();
    const command = client.commands.get(cmdName) || client.commands.find(c=>c.aliases && c.aliases.includes(cmdName));
    if(!command) return;

    try{ await command.run(client,message,args,prefix); }
    catch(err){ console.error(err); message.channel.send("❌ Ocurrió un error al ejecutar el comando."); }
};
