const { EmbedBuilder, ActivityType } = require("discord.js");

module.exports = {
    name: "setpresence",
    aliases: ["presence", "presencia"],
    category: "Configuración",
    description: "Cambia la presencia del bot en este servidor",
    run: (client, message, args) => {
        if (!message.member.permissions.has("Administrator")) {
            return message.channel.send({
                embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ No tienes permisos para usar este comando.")]
            });
        }

        const type = args[0]?.toLowerCase();
        const text = args.slice(1).join(" ");

        const activityTypes = {
            jugando: ActivityType.Playing,
            viendo: ActivityType.Watching,
            escuchando: ActivityType.Listening,
            compitiendo: ActivityType.Competing
        };

        if (!type || !text || !activityTypes[type]) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor("Yellow")
                    .setDescription("❌ Uso: `!setpresence <jugando|viendo|escuchando|compitiendo> <texto>`")]
            });
        }

        client.user.setActivity(text, { type: activityTypes[type] });

        message.channel.send({
            embeds: [new EmbedBuilder()
                .setColor("Green")
                .setDescription(`✅ Presencia cambiada a **${type} ${text}**`)]
        });
    }
};
