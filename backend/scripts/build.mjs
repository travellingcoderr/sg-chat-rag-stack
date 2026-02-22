#!/usr/bin/env node
/**
 * Fast build: transpile only with esbuild (no type-check). Use `npm run typecheck` for types.
 */
import * as fs from 'fs'
import * as path from 'path'
import { build } from 'esbuild'

const srcDir = 'src'
const outDir = 'dist'

function findTsFiles(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    if (fs.statSync(full).isDirectory()) findTsFiles(full, files)
    else if (name.endsWith('.ts')) files.push(full)
  }
  return files
}

const entryPoints = findTsFiles(srcDir)

await build({
  entryPoints,
  outdir: outDir,
  outbase: srcDir,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  sourcemap: true,
  logLevel: 'info',
})

console.log('Build done.')
