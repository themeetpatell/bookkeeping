/** Reads the route table out of src/App.jsx: URL path → component → file. */

const LAZY = /const\s+(\w+)\s*=\s*lazy\(\s*\(\)\s*=>\s*import\(\s*['"]\.\/([^'"]+)['"]\s*\)\s*\)/g;
const ROUTE = /<Route\s+path="([^"]+)"\s+element=\{\s*<(\w+)([^>]*?)\/>\s*\}/g;

export function parseRoutes(appSource) {
  const files = new Map([...appSource.matchAll(LAZY)].map((m) => [m[1], `src/${m[2]}.jsx`]));
  return [...appSource.matchAll(ROUTE)].map(([, path, component, props]) => ({
    path,
    component,
    file: files.get(component) ?? null,
    ...(props.trim() ? { props: props.trim() } : {}),
  }));
}
