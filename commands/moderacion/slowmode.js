const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "slowmode",
    aliases: ["modolento", "slow"],
    category: "Moderación",
    description: "Establece el slowmode en el canal actual",
    usage: "!slowmode <tiempo> (0 para desactivar)",
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("❌ No tienes permisos para usar este comando.")
                ]
            });
        }

        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setDescription("⚠️ Debes especificar un tiempo en segundos, minutos o horas. Ejemplo: `!slowmode 10s`, `!slowmode 5m`, `!slowmode 1h`, `!slowmode 0`")
                ]
            });
        }

        let time = args[0].toLowerCase();
        let seconds = 0;

        if (time.endsWith("s")) {
            seconds = parseInt(time.replace("s", ""));
        } else if (time.endsWith("m")) {
            seconds = parseInt(time.replace("m", "")) * 60;
        } else if (time.endsWith("h")) {
            seconds = parseInt(time.replace("h", "")) * 3600;
        } else if (!isNaN(time)) {
            seconds = parseInt(time);
        } else {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("❌ Formato inválido. Usa `Xs`, `Xm` o `Xh`.")
                ]
            });
        }

        if (isNaN(seconds) || seconds < 0 || seconds > 21600) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("⚠️ El tiempo debe estar entre `0` y `21600` segundos (6 horas).")
                ]
            });
        }

        try {
            await message.channel.setRateLimitPerUser(seconds);

            let desc = seconds === 0
                ? "✅ Slowmode **desactivado** en este canal."
                : `✅ Slowmode establecido a **${time}** en este canal.`;

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setDescription(desc)
                ]
            });
        } catch (error) {
            console.error(error);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("❌ Hubo un error al intentar cambiar el slowmode.")
                ]
            });
        }
    }
};
