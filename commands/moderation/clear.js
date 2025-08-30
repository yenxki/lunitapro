module.exports = {
    name: "clear",
    aliases: ["purge", "limpiar"],
    description: "Elimina mensajes en el canal actual.",
    usage: "clear <cantidad>",
    category: "Moderation",
    run: async (client, message, args, prefix) => {
        const { EmbedBuilder } = require("discord.js");

        // Verificar permisos
        if (!message.member.permissions.has("ManageMessages")) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`${client.emojisData.error} No tienes permiso para usar este comando.`)
                ]
            });
        }

        const amount = parseInt(args[0]);
        if (!amount || amount < 1 || amount > 100) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setDescription(`${client.emojisData.info} Debes especificar un número válido entre 1 y 100.`)
                ]
            });
        }

        try {
            await message.channel.bulkDelete(amount, true);
            const embed = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`${client.emojisData.success} Se eliminaron **${amount}** mensajes correctamente.`);

            message.channel.send({ embeds: [embed] }).then(msg => {
                setTimeout(() => msg.delete().catch(() => {}), 5000); // El embed de confirmación se borra después de 5s
            });
        } catch (err) {
            console.log(err);
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`${client.emojisData.error} No se pudieron eliminar los mensajes.`)
                ]
            });
        }
    }
};
