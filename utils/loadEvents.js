import fs from "fs";
import path from "path";

export function loadEvents(client, dir) {
    const eventFiles = fs.readdirSync(dir).filter(file => file.endsWith(".js"));
    for (const file of eventFiles) {
        import(path.join(dir, file)).then(event => {
            const evt = event.default;
            if (evt.name) {
                if (evt.once) {
                    client.once(evt.name, (...args) => evt.execute(...args, client));
                } else {
                    client.on(evt.name, (...args) => evt.execute(...args, client));
                }
                console.log(`✅ Evento cargado: ${evt.name}`);
            }
        });
    }
}
