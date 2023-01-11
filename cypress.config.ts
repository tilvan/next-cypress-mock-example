import { defineConfig } from 'cypress'
import next from 'next';
import {createServer} from "http";
import {parse} from "url";
import nock from 'nock';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents: async (on, config) => {
      const port = parseInt(process.env.PORT || '3000', 10);
      const dev = process.env.NODE_ENV !== 'production';
      const app = next({ dev });
      const handle = app.getRequestHandler();

      app.prepare().then(() => {
        createServer((req, res) => {
          const parsedUrl = parse(req.url!, true);
          handle(req, res, parsedUrl);
        }).listen(port);

        console.log(
          `> Server listening at http://localhost:${port} as ${
            dev ? 'development' : process.env.NODE_ENV
          }`
        );
      });

      on('task', {
        clearNock() {
          nock.restore();
          nock.cleanAll();

          return null;
        },

        async nock(params) {
          const {
            hostname,
            method = 'GET',
            path,
            body,
            statusCode = 200,
          } = params;

          if (!nock.isActive()) {
            nock.activate();
          }

          console.log(
            `nock will: ${method} ${hostname}${path} respond with: `,
            {
              body,
              statusCode,
            }
          );

          nock.disableNetConnect();
          nock(hostname)
            [method.toLowerCase()](path)
            .reply(statusCode, body);

          return null;
        },
      });

      return config;
    },
  },
})
