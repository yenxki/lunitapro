const { PermissionsBitField, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: "ban",
    aliases: ["banear"],
    category: "Moderación",
    description: "Banea a un usuario con un motivo usando un modal",
    usage: "!ban <@usuario>",
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.channel.send({
                embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ No tienes permisos para banear miembros.")]
            });
        }

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) {
            return message.channel.send({
                embeds: [new EmbedBuilder().setColor("Red").setDescription("⚠️ Debes mencionar a un usuario o poner su ID.")]
            });
        }

        if (!user.bannable) {
            return message.channel.send({
                embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ No puedo banear a este usuario.")]
            });
        }

        const modal = new ModalBuilder()
            .setCustomId(`ban_modal_${user.id}`)
            .setTitle(`Banear a ${user.user.tag}`);

        const motivoInput = new TextInputBuilder()
            .setCustomId("motivo")
            .setLabel("Motivo del ban")
            .setPlaceholder("Escribe el motivo del ban...")
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);

        modal.addComponents(new ActionRowBuilder().addComponents(motivoInput));

        await message.channel.send({
            embeds: [new EmbedBuilder().setColor("Yellow").setDescription(`✏️ ${message.author}, revisa tu modal para escribir el motivo.`)]
        });

        await message.author.send({ content: "Usa este modal para confirmar el ban." }).catch(() => {});

        message.client.once("interactionCreate", async interaction => {
            if (!interaction.isModalSubmit()) return;
            if (interaction.customId !== `ban_modal_${user.id}`) return;

            const motivo = interaction.fields.getTextInputValue("motivo");

            await user.ban({ reason: motivo });

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setDescription(`✅ **${user.user.tag}** fue baneado por **${message.author.tag}**\n📄 Motivo: ${motivo}`)
                ]
            });
        });
    }
};
