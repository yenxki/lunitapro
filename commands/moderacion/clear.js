const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "clear",
    aliases: ["purge", "limpiar"],
    category: "Moderación",
    description: "Borra un número específico de mensajes en el canal (sin borrar mensajes fijados)",
    usage: "!clear <cantidad>",
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("❌ No tienes permisos para usar este comando.")
                ]
            });
        }

        const cantidad = parseInt(args[0]);
        if (!cantidad || isNaN(cantidad) || cantidad < 1 || cantidad > 100) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("⚠️ Debes especificar un número válido entre 1 y 100.")
                ]
            });
        }

        // Embed de confirmación
        const confirmEmbed = new EmbedBuilder()
            .setColor("Yellow")
            .setDescription(`⚠️ Estás a punto de borrar **${cantidad}** mensajes.\n\n✅ Presiona **Confirmar** para continuar\n❌ Presiona **Cancelar** para anular`);

        const botones = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("confirmar_clear")
                .setLabel("Confirmar")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("cancelar_clear")
                .setLabel("Cancelar")
                .setStyle(ButtonStyle.Danger)
        );

        const msgConfirmacion = await message.channel.send({
            embeds: [confirmEmbed],
            components: [botones]
        });

        // Crear colector de interacción
        const collector = msgConfirmacion.createMessageComponentCollector({
            time: 15000 // 15 segundos
        });

        collector.on("collect", async i => {
            if (i.user.id !== message.author.id) {
                return i.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription("❌ Solo la persona que ejecutó el comando puede confirmar o cancelar.")
                    ],
                    ephemeral: true
                });
            }

            if (i.customId === "confirmar_clear") {
                try {
                    const mensajes = await message.channel.messages.fetch({ limit: cantidad + 5 });
                    const mensajesBorrables = mensajes.filter(msg => !msg.pinned && msg.id !== msgConfirmacion.id && msg.id !== message.id);

                    await message.channel.bulkDelete(mensajesBorrables, true);

                    const embedExito = new EmbedBuilder()
                        .setColor("Green")
                        .setDescription(`✅ Se han borrado **${mensajesBorrables.size}** mensajes correctamente (ignorando mensajes fijados).`);

                    await i.update({ embeds: [embedExito], components: [] });

                    setTimeout(() => msgConfirmacion.delete().catch(() => {}), 5000);
                } catch (error) {
                    console.error(error);
                    await i.update({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setDescription("❌ Ocurrió un error al intentar borrar los mensajes.")
                        ],
                        components: []
                    });
                }
                collector.stop();
            }

            if (i.customId === "cancelar_clear") {
                await i.update({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Grey")
                            .setDescription("❌ Operación cancelada.")
                    ],
                    components: []
                });
                collector.stop();
            }
        });

        collector.on("end", (_, reason) => {
            if (reason === "time") {
                msgConfirmacion.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Grey")
                            .setDescription("⌛ Tiempo de confirmación agotado. Operación cancelada.")
                    ],
                    components: []
                }).catch(() => {});
            }
        });
    }
};
