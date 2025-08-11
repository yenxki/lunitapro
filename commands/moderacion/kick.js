const { PermissionsBitField, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: "kick",
    aliases: ["expulsar"],
    category: "Moderación",
    description: "Expulsa a un usuario con un motivo usando un modal",
    usage: "!kick <@usuario>",
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.channel.send({
                embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ No tienes permisos para expulsar miembros.")]
            });
        }

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) {
            return message.channel.send({
                embeds: [new EmbedBuilder().setColor("Red").setDescription("⚠️ Debes mencionar a un usuario o poner su ID.")]
            });
        }

        if (!user.kickable) {
            return message.channel.send({
                embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ No puedo expulsar a este usuario.")]
            });
        }

        const modal = new ModalBuilder()
            .setCustomId(`kick_modal_${user.id}`)
            .setTitle(`Expulsar a ${user.user.tag}`);

        const motivoInput = new TextInputBuilder()
            .setCustomId("motivo")
            .setLabel("Motivo de la expulsión")
            .setPlaceholder("Escribe el motivo...")
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);

        modal.addComponents(new ActionRowBuilder().addComponents(motivoInput));

        await message.channel.send({
            embeds: [new EmbedBuilder().setColor("Yellow").setDescription(`✏️ ${message.author}, revisa tu modal para escribir el motivo.`)]
        });

        message.client.once("interactionCreate", async interaction => {
            if (!interaction.isModalSubmit()) return;
            if (interaction.customId !== `kick_modal_${user.id}`) return;

            const motivo = interaction.fields.getTextInputValue("motivo");

            await user.kick(motivo);

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setDescription(`✅ **${user.user.tag}** fue expulsado por **${message.author.tag}**\n📄 Motivo: ${motivo}`)
                ]
            });
        });
    }
};
