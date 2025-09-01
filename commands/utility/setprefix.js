const fs = require("fs");
const config = require("../../config.json");

module.exports = {
  name: "setprefix",
  description: "Cambia el prefijo del bot.",
    category: "Admin",
  async execute({ client, message, args, createEmbed }) {
    if (!message.member.permissions.has("Administrator")) return message.channel.send({
      embeds: [createEmbed(message.guild, `${client.emojisJSON.error} No tienes permisos para usar este comando.`, "Permisos insuficientes")]
    });

    const newPrefix = args[0];
    if (!newPrefix) return message.channel.send({ embeds: [createEmbed(message.guild, "Debes indicar un nuevo prefijo.")] });

    config.prefix = newPrefix;
    fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
    client.prefix = newPrefix;

    message.channel.send({ embeds: [createEmbed(message.guild, `Prefijo cambiado a **${newPrefix}**`)] });
  }
};
