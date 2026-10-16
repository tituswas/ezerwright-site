import entries from './plugins.json' with {type:'json'};

/** Release entries are plain text. HTML/Markdown is never executed by templates. */
export function validatePlugins(entries) {
  if (!Array.isArray(entries)) throw new Error('Plugins must be an array');
  const slugs = new Set();
  for (const entry of entries) {
    if (!entry || !['draft', 'published'].includes(entry.status)) throw new Error('Invalid plugin status');
    if (typeof entry.slug !== 'string' || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(entry.slug) || entry.slug.length > 80 || entry.slug === 'services' || slugs.has(entry.slug)) throw new Error('Invalid or duplicate plugin slug');
    slugs.add(entry.slug);
    for (const field of ['name', 'summary', 'dataPractices', 'license', 'version', 'releaseDate']) {
      if (typeof entry[field] !== 'string' || !entry[field].trim() || entry[field].length > 5000) throw new Error(`Invalid plugin ${field}`);
    }
    for (const field of ['platforms', 'prerequisites', 'permissions', 'installation']) {
      if (!Array.isArray(entry[field]) || !entry[field].length || entry[field].some(value => typeof value !== 'string' || !value.trim() || value.length > 5000)) throw new Error(`Invalid plugin ${field}`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.releaseDate) || !Number.isFinite(Date.parse(entry.releaseDate)) || new Date(entry.releaseDate).toISOString().slice(0, 10) !== entry.releaseDate) throw new Error('Invalid plugin releaseDate');
    for (const key of ['docs', 'source', 'install']) {
      const value = entry.links?.[key];
      if (typeof value !== 'string' || /\s/.test(value)) throw new Error(`Invalid plugin ${key} link`);
      const url = new URL(value);
      if (url.protocol !== 'https:' || url.username || url.password) throw new Error(`Plugin ${key} link must use HTTPS without credentials`);
    }
  }
  return entries;
}

export const publishedPlugins = validatePlugins(entries).filter(entry => entry.status === 'published');
export const pluginRoutes = site => site.template === 'client' ? [] : ['plugins', 'plugins/services', ...publishedPlugins.map(entry => `plugins/${entry.slug}`)];
