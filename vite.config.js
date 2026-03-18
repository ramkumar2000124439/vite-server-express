import { defineConfig } from "vite";
import { expressPlugin } from "./express-plugin.js";

export default defineConfig({
    plugins: [expressPlugin()],
    server:{
        port: 3000,
    },
    build: {
        rolldownOptions: {
            input: "./server.js",
            output:{
                format: "esm",
                entryFileNames: "server.js",
            }
        },
        ssr: true,
    }
});
