// events/messageCreate.js
const config = require('../config.json');
const prefixes = require('../data/prefixes.json');

module.exports = async (client, message) => {
  if (!message.guild || message.author.bot) return;

  const prefix = prefixes[message.guild.id] || config.defaultPrefix;

  // Si mencionan al bot, ejecuta help
  if (message.mentions.users.has(client.user.id)) {
    const helpCmd = client.commands.get('help');
    if (helpCmd) {
      return helpCmd.run(client, message, [], prefix);
    }
  }

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();

  const command =
    client.commands.get(cmdName) ||
    client.commands.get(client.aliases.get(cmdName));

  if (!command) return;
  try {
    await command.run(client, message, args, prefix);
  } catch (err) {
    console.error(err);
  }
};
