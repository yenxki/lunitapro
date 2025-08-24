import { EmbedBuilder } from "discord.js";
import fs from "fs";
const dataPath = "./data/guilds.json";

export default {
    name: "guildMemberAdd",
    async execute(member) {
        const guildsConfig = JSON.parse(fs.readFileSync(dataPath, "utf8"));
        const guildConfig = guildsConfig[member.guild.id] || {};

        const channelName = guildConfig.welcomeChannel || "bienvenida";
        const channel = member.guild.channels.cache.find(ch => ch.name === channelName);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle("🎉 ¡Bienvenido!")
            .setDescription(`Hola ${member.user}, ¡bienvenido/a a **${member.guild.name}**!\n\nEsperamos que la pases increíble. No olvides leer las reglas y presentarte.`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Miembro número ${member.guild.memberCount}` });

        channel.send({ embeds: [embed] });
    }
};
