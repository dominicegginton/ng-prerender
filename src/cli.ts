#! /usr/bin/env node

/**
 * Prerender an Angular application given relative path to
 * built application and path.
 *
 * ```
 * ng-prerender [dist] [path-one] [path-two] [path-three] ...
 * ```
 */

import { prerender } from './prerender.js';

await prerender(
  process.argv[2],
  process.argv.splice(3, process.argv.length)
);
