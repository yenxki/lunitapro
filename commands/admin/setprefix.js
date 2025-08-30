const fs = require("fs");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "setprefix",
    aliases: ["prefix"],
    description: "Cambia el prefijo de tu servidor",
    usage: "setprefix <nuevo prefijo>",
    category: "Utility",
    run: async(client, message, args) => {
        if(!message.member.permissions.has("Administrator")){
            return message.channel.send({embeds:[new EmbedBuilder().setColor("Red").setDescription("❌ Necesitas permisos de administrador para cambiar el prefijo.")]} );
        }

        const newPrefix = args[0];
        if(!newPrefix) return message.channel.send({embeds:[new EmbedBuilder().setColor("Yellow").setDescription("❌ Debes especificar un nuevo prefijo.")]} );

        // Leer y actualizar JSON
        const filePath = "./data/prefixes.json";
        let prefixes = JSON.parse(fs.readFileSync(filePath,"utf8"));
        prefixes[message.guild.id] = newPrefix;
        fs.writeFileSync(filePath, JSON.stringify(prefixes,null,4));

        // Actualizar en memoria
        client.prefixes.set(message.guild.id, newPrefix);

        message.channel.send({embeds:[new EmbedBuilder().setColor("Green").setDescription(`✅ Prefijo cambiado a: \`${newPrefix}\``)]});
    }
};
