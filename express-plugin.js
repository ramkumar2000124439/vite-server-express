import process from 'node:process';

const expressPlugin = ({ entry, appName = "app" }) => {
  const isDev = process.env.NODE_ENV !== 'production';

  return {
    name: 'expressPlugin-vite',
    config: () => ({
      build: {
        ssr: entry,
        rolldownOptions: {
          input: entry,
          output: {
            format: "esm",
            entryFileNames: "server.js",
          }
        },
      }
    }),
    configureServer: async (server) => {
      if (isDev) {
        const module = await server.ssrLoadModule(entry);
        const app = await module[appName] || await module.default;
        if (app) {
          server.middlewares.use(app);
        }
      }
    }
  }
}

export { expressPlugin }
export default expressPlugin;