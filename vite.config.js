import { defineConfig } from "vite";
import { expressPlugin } from "./express-plugin.js";

export default defineConfig({
    plugins: [expressPlugin({ entry: "./server.js" })],
    server: {
        port: 3000,
    }
});
