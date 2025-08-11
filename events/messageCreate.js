const { EmbedBuilder } = require("discord.js");
const config = require("../config.json");
const prefixManager = require("../utils/prefixManager");

module.exports = async (client, message) => {
    if (message.author.bot || !message.guild) return;

    const prefix = prefixManager.getPrefix(message.guild.id) || config.defaultPrefix;

    // Responder si mencionan al bot
    if (message.mentions.has(client.user)) {
        const embed = new EmbedBuilder()
            .setColor("Purple")
            .setTitle("📜 Lista de comandos")
            .setDescription(`Usa \`${prefix}help\` para ver todos mis comandos.`)
            .setFooter({ text: "Lunita Bot" });

        return message.channel.send({ embeds: [embed] });
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    const commandName = client.commands.has(cmd) ? cmd : client.aliases.get(cmd);
    if (!commandName) return;

    const command = client.commands.get(commandName);
    try {
        command.run(client, message, args);
    } catch (err) {
        console.error(err);
        message.channel.send({ embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ Ocurrió un error ejecutando el comando.")] });
    }
};
