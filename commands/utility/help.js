const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fs = require("fs");

module.exports = {
    name: "help",
    aliases: ["h"],
    description: "Muestra todos los comandos disponibles con categorías, uso y aliases",
    usage: "help [comando]",
    category: "Utility",
    run: async(client, message, args, prefix) => {
        const commands = client.commands;

        if(args[0]){
            const cmd = commands.get(args[0]) || commands.find(c => c.aliases && c.aliases.includes(args[0]));
            if(!cmd) return message.channel.send(`❌ Comando no encontrado.`);
            const embed = new EmbedBuilder()
                .setTitle(`Comando: ${cmd.name}`)
                .setColor("Blue")
                .addFields(
                    {name:"Descripción", value: cmd.description || "No tiene descripción"},
                    {name:"Uso", value: `\`${prefix}${cmd.usage}\`` || "No definido"},
                    {name:"Categoría", value: cmd.category || "No definida"},
                    {name:"Aliases", value: cmd.aliases.length>0 ? cmd.aliases.join(", ") : "Ninguna"}
                );
            return message.channel.send({embeds:[embed]});
        }

        // Agrupar comandos por categoría
        const categories = {};
        commands.forEach(cmd => {
            const cat = cmd.category || "Sin categoría";
            if(!categories[cat]) categories[cat] = [];
            categories[cat].push(cmd.name);
        });

        const embed = new EmbedBuilder()
            .setTitle("📜 Menú de comandos")
            .setColor("Blue")
            .setDescription(`Prefijo actual: \`${prefix}\`\nHaz \`${prefix}help <comando>\` para más info.`);

        for(const cat in categories){
            embed.addFields({name: cat, value: categories[cat].join(", "), inline:false});
        }

        // Botones de categorías (solo ilustrativo, pueden abrir más embeds o links si quieres)
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId("help_fun").setLabel("Fun").setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId("help_economy").setLabel("Economy").setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId("help_util").setLabel("Utility").setStyle(ButtonStyle.Primary)
            );

        message.channel.send({embeds:[embed], components:[row]});
    }
};
