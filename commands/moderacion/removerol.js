const { PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "removerol",
    aliases: ["quitarrol", "removerole", "remover"],
    category: "Moderación",
    description: "Quita un rol a un usuario",
    usage: "!removerol <usuario> <rol>",
    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("❌ No tienes permisos para usar este comando.")
                ]
            });
        }

        if (!args[0] || !args[1]) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setDescription("⚠️ Uso correcto: `!removerol <usuario> <rol>`")
                ]
            });
        }

        const miembro = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!miembro) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("❌ No se encontró al usuario especificado.")
                ]
            });
        }

        const rol = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.slice(1).join(" ").toLowerCase()) || message.guild.roles.cache.get(args[1]);
        if (!rol) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("❌ No se encontró el rol especificado.")
                ]
            });
        }

        if (!miembro.roles.cache.has(rol.id)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setDescription(`⚠️ El usuario **${miembro.user.tag}** no tiene el rol **${rol.name}**.`)
                ]
            });
        }

        try {
            await miembro.roles.remove(rol);

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setDescription(`✅ Rol **${rol.name}** removido de **${miembro.user.tag}** correctamente.`)
                ]
            });
        } catch (error) {
            console.error(error);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("❌ No pude remover el rol. Verifica que mi rol esté por encima del que quieres quitar.")
                ]
            });
        }
    }
};
