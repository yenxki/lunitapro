const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const verificationManager = require("../../utils/verificationManager");

module.exports = {
    name: "verifysetup",
    aliases: ["setverify", "setupverify"],
    category: "Verificación",
    description: "Configura el sistema de verificación en este servidor",
    run: async (client, message, args) => {
        if (!message.member.permissions.has("Administrator")) {
            return message.channel.send({
                embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ No tienes permisos para usar este comando.")]
            });
        }

        const channel = message.mentions.channels.first();
        const role = message.mentions.roles.first();

        if (!channel || !role) {
            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setColor("Yellow")
                    .setDescription("❌ Uso: `!verifysetup #canal @rol`")]
            });
        }

        verificationManager.setConfig(message.guild.id, channel.id, role.id);

        const verifyEmbed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("🔐 Verificación")
            .setDescription("Presiona el botón para comenzar la verificación.");

        const button = new ButtonBuilder()
            .setCustomId("startVerify")
            .setLabel("Verificarme")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        await channel.send({ embeds: [verifyEmbed], components: [row] });

        message.channel.send({
            embeds: [new EmbedBuilder()
                .setColor("Green")
                .setDescription(`✅ Verificación configurada en ${channel} con el rol ${role}`)]
        });
    }
};
