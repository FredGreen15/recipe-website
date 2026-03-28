import { readFileSync } from 'fs'
import { resolve } from 'path'

const manifestPath = resolve(__dirname, '../public/manifest.json')
const indexPath = resolve(__dirname, '../index.html')

test('manifest.json has required PWA fields', () => {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
  expect(manifest.name).toBe('Frecipe')
  expect(manifest.short_name).toBe('Frecipe')
  expect(manifest.display).toBe('standalone')
  expect(manifest.theme_color).toBe('#ffffff')
  expect(manifest.background_color).toBe('#ffffff')
})

test('manifest.json references 192 and 512 icons', () => {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
  const sizes = manifest.icons.map((i: { sizes: string }) => i.sizes)
  expect(sizes).toContain('192x192')
  expect(sizes).toContain('512x512')
})

test('index.html title is Frecipe', () => {
  const html = readFileSync(indexPath, 'utf-8')
  expect(html).toContain('<title>Frecipe</title>')
})

test('index.html links to manifest', () => {
  const html = readFileSync(indexPath, 'utf-8')
  expect(html).toContain('rel="manifest"')
})

test('index.html has theme-color meta tag', () => {
  const html = readFileSync(indexPath, 'utf-8')
  expect(html).toContain('name="theme-color"')
})
