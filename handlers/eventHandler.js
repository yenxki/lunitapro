const fs = require("fs");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionType } = require("discord.js");
const { defaultPrefix } = require("../config");
const { executeHelp } = require("./helpHandler");

// Colores por categoría
const categoryColors = {
    Fun: "Purple",
    Moderation: "Red",
    Utility: "Blue"
    // Añadir más categorías y colores si deseas
};

module.exports = (client) => {
    client.on("messageCreate", async message => {
        if (message.author.bot) return;

        // Cargar prefijo del servidor
        let prefixes = JSON.parse(fs.readFileSync("./data/prefixes.json", "utf8"));
        if (!prefixes[message.guild.id]) prefixes[message.guild.id] = defaultPrefix;
        let prefix = prefixes[message.guild.id];

        const msgContent = message.content.toLowerCase();

        // Responder al ser mencionado o al usar !help
        if (message.mentions.has(client.user) || msgContent === `${prefix}help`) {
            return executeHelp(message, client, prefix);
        }

        // Comandos con prefix
        if (!msgContent.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const cmdName = args.shift().toLowerCase();

        const command = client.commands.get(cmdName) || client.commands.get(client.aliases.get(cmdName));
        if (!command) return;

        try {
            command.run(client, message, args, prefix);
        } catch (e) {
            console.log(e);
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`${client.emojisData.error} Ocurrió un error al ejecutar el comando.`)
                ]
            });
        }
    });

    // Interacciones de botones del help
    client.on("interactionCreate", async interaction => {
        if (interaction.type !== InteractionType.MessageComponent) return;

        const [action, category] = interaction.customId.split("_");
        if (action !== "help") return;

        const commands = client.commands.filter(cmd => cmd.category.toLowerCase() === category.toLowerCase());
        if (!commands.size) return interaction.reply({ content: "No hay comandos en esta categoría.", ephemeral: true });

        const embed = new EmbedBuilder()
            .setTitle(`${client.emojisData[category] || ""} Comandos: ${category.charAt(0).toUpperCase() + category.slice(1)}`)
            .setDescription(`Lista de comandos de la categoría **${category}**:`)
            .setColor(categoryColors[category] || "Grey");

        commands.forEach(cmd => {
            embed.addFields({
                name: `${cmd.name} ${cmd.aliases.length ? `(Aliases: ${cmd.aliases.join(", ")})` : ""}`,
                value: `**Uso:** \`${cmd.usage}\`\n**Descripción:** ${cmd.description}`,
                inline: false
            });
        });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    });
};
