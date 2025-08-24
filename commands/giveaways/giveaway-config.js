import fs from "fs";
const dataPath = "./data/guilds.json";

export default {
  name: "giveaway-config",
  description: "Configura la categoría donde se crearán los canales de los ganadores.",
  async execute(message, args) {
    if (!message.member.permissions.has("Administrator")) {
      return message.reply("❌ Solo los administradores pueden usar este comando.");
    }

    const categoryName = args.join(" ");
    if (!categoryName) return message.reply("Uso: `!giveaway-config <nombre de la categoría>`");

    const guildsConfig = JSON.parse(fs.readFileSync(dataPath, "utf8") || "{}");
    if (!guildsConfig[message.guild.id]) guildsConfig[message.guild.id] = {};

    guildsConfig[message.guild.id].giveawayCategory = categoryName;
    fs.writeFileSync(dataPath, JSON.stringify(guildsConfig, null, 2));

    message.reply(`✅ Categoría para canales ganadores configurada: **${categoryName}**`);
  }
};
