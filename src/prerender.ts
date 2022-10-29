import { Engine } from '@nguniversal/common/clover/server';
import { join } from 'path';
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';

/** NgUniversal Clover Engine. */
const engine = new Engine();

/**
 * Write HTML.
 *
 * Write HTML file to dist directory and copies
 * original index.html
 */
function writeHTML(dist: string, path: string, html: string) {
  /* If path is index then copy original index.html */
  if (path === '' || path === '/') {
    copyFileSync(join(dist, 'index.html'), join(dist, 'index.original.html'));
  }
  /* Ensure dist directory exists */
  if (!existsSync(join(dist, path))) {
    mkdirSync(join(dist, path));
  }
  /* Write HTML file */
  writeFileSync(join(dist, path, 'index.html'), html);
}

/**
 * Prerender a built Angular Application.
 *
 * Uses `@nguniversal/common/clover` to prerender routes for the built
 * Angular application located in the given dist directory.
 */
export async function prerender(dist: string, routes: Array<string>) {
  dist = join(process.cwd(), dist);
  /**
   * Ensure index routes are prepended last as the original
   * index.html is required for prerender all routes.
   */
  ['', '/'].forEach((path) => {
    if (routes.includes(path))
      routes = [...routes.filter((route) => route !== path), path];
  });
  for (const route of routes) {
    const url = new URL(`http://localhost/${route}`);
    const html = await engine.render({
      publicPath: dist,
      url: String(url),
    });
    writeHTML(dist, route, html);
  }
}
