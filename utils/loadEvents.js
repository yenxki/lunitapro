import fs from "fs";
import path from "path";

export function loadEvents(client, dir) {
    fs.readdirSync(dir).forEach(f => {
        if (!f.endsWith(".js")) return;
        import(path.join(dir, f)).then(event => {
            client.on(event.default.name, (...args) => event.default.execute(client, ...args));
            console.log(`✅ Evento cargado: ${event.default.name}`);
        });
    });
}
