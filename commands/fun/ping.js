module.exports = {
    name: "ping",
    aliases: ["p"],
    description: "Muestra la latencia del bot",
    usage: "ping",
    category: "Fun",
    run: async (client, message, args, prefix) => {
        const { EmbedBuilder } = require("discord.js");
        const embed = new EmbedBuilder()
            .setTitle(`${client.emojisData.info} Pong!`)
            .setDescription(`Latencia: \`${Date.now() - message.createdTimestamp}ms\``)
            .setColor("Green");

        message.channel.send({ embeds: [embed] });
    }
};
