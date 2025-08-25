import fs from "fs";
import path from "path";

export function loadCommands(client, dir) {
    const categories = fs.readdirSync(dir);
    for (const category of categories) {
        const categoryPath = path.join(dir, category);
        if (fs.lstatSync(categoryPath).isDirectory()) {
            const files = fs.readdirSync(categoryPath).filter(f => f.endsWith(".js"));
            for (const file of files) {
                import(path.join(categoryPath, file)).then((cmd) => {
                    client.commands.set(cmd.default.name, cmd.default);
                    console.log(`Comando cargado: ${cmd.default.name}`);
                });
            }
        }
    }
}
