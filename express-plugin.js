import process from 'node:process';

const isDev = process.env.NODE_ENV !== 'production';
const expressPlugin = () => {
  if (isDev) {
    return {
      name: 'expressPlugin-vite',
      configureServer: async(server) => {
        const app = await import('./server.js').then(m => m.app);
        server.middlewares.use(app);
      }
    }
  }
  return false
}
// --------------

export { expressPlugin }
export default expressPlugin;