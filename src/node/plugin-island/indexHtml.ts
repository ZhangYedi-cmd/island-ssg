import {readFile} from "fs/promises";
import {Plugin} from "vite";
import {DEFAULT_HTML_PATH} from "../constants";

// 使 vite dev server 响应 HTML
export function islandHtmlPlugin(): Plugin {
  return {
    name: "island:index-html",
    apply: "serve",
    // get http request
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let html = await readFile(DEFAULT_HTML_PATH, "utf-8");
          try {
            // Hot Module Replace
            html = await server.transformIndexHtml(
              req.url,
              html,
              req.originalUrl
            );
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(html);
          } catch (e) {
            return next(e);
          }
        });
      };
    },
  };
}
