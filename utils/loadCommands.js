import fs from "fs";
import path from "path";

export function loadCommands(client, dir) {
    const folders = fs.readdirSync(dir);
    for (const folder of folders) {
        const commandFiles = fs.readdirSync(path.join(dir, folder)).filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            import(path.join(dir, folder, file)).then(command => {
                const cmd = command.default;
                if (cmd.name) {
                    client.commands.set(cmd.name, cmd);
                    console.log(`✅ Comando cargado: ${cmd.name}`);
                }
            });
        }
    }
}
