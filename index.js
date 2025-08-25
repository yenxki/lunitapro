const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const fs = require('fs');
const config = require('./config.json'); // defaultPrefix y token

// Crear instancia de client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Inicializar mapas para comandos y aliases
client.commands = new Map();
client.aliases = new Map();

// Prefijos por servidor
client.prefixes = {}; // Ej: { 'guildID': '!' }

// Función para cargar comandos
const loadCommands = () => {
  const categories = fs.readdirSync('./commands');
  categories.forEach(category => {
    const files = fs.readdirSync(`./commands/${category}`).filter(f => f.endsWith('.js'));
    files.forEach(file => {
      const command = require(`./commands/${category}/${file}`);
      client.commands.set(command.name, command);
      if (command.aliases) {
        command.aliases.forEach(alias => client.aliases.set(alias, command.name));
      }
    });
  });

  // Mostrar en consola comandos por categoría
  console.log('📂 Comandos cargados:');
  categories.forEach(category => {
    const commandsInCategory = fs.readdirSync(`./commands/${category}`).filter(f => f.endsWith('.js')).map(f => f.replace('.js',''));
    console.log(`- ${category}: ${commandsInCategory.join(', ')}`);
  });
};

loadCommands();

// Evento de mensaje
client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return;

  let prefix = client.prefixes[message.guild.id] || config.defaultPrefix;
  if (message.mentions.has(client.user)) return message.channel.send(`Usa \`${prefix}help\``);

  if (!message.content.startsWith(prefix)) return;

  const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/\s+/);
  const commandName = cmd.toLowerCase();
  const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
  if (!command) return;

  try {
    command.run(client, message, args);
  } catch (err) {
    console.error(err);
    message.reply('Ocurrió un error al ejecutar el comando.');
  }
});

// Evento ready: presencias y log de conexión
client.on('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);

  // Presencia del bot
  client.user.setPresence({
    activities: [{ name: '👀 Viendo a @gerasaurio', type: ActivityType.Watching }],
    status: 'online'
  });
});

// Login del bot
client.login(config.token);
