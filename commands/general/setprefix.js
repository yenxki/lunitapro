const { EmbedBuilder } = require("discord.js");
const prefixManager = require("../../utils/prefixManager");
const config = require("../../config.json");

module.exports = {
    name: "setprefix",
    aliases: ["prefix", "cambioprefijo"],
    category: "Configuración",
    description: "Cambia el prefijo del bot en este servidor",
    run: (client, message, args) => {
        if (!message.member.permissions.has("Administrator")) {
            return message.channel.send({
                embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ No tienes permisos para usar este comando.")]
            });
        }

        const newPrefix = args[0];
        if (!newPrefix) {
            return message.channel.send({
                embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ Debes especificar un nuevo prefijo.")]
            });
        }

        prefixManager.setPrefix(message.guild.id, newPrefix);
        message.channel.send({
            embeds: [new EmbedBuilder().setColor("Green").setDescription(`✅ Prefijo cambiado a \`${newPrefix}\``)]
        });
    }
};
