import path from "path";
import express from "express";
import session from "express-session";
import { renderFile } from "ejs";

const viewsPath = path.join(__dirname, "../../views/admin");

export function renderAdmin(
  res: express.Response,
  page: string,
  data: Record<string, unknown> = {}
) {
  const layoutPath = path.join(viewsPath, "layout.ejs");
  const pagePath = path.join(viewsPath, `${page}.ejs`);

  renderFile(pagePath, data, {}, (err: Error | null, bodyHtml?: string) => {
    if (err || !bodyHtml) {
      console.error(err);
      return res.status(500).send("Template error");
    }
    renderFile(layoutPath, { ...data, body: bodyHtml }, {}, (err2: Error | null, html?: string) => {
      if (err2 || !html) {
        console.error(err2);
        return res.status(500).send("Layout error");
      }
      res.send(html);
    });
  });
}

export function setupSession(app: express.Application) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || "dev-session-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      },
    })
  );
}
