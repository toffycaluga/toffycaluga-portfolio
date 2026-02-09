export async function loadData(name) {
  const code = window.currentLang;
  if (!code) throw new Error(`[data] window.currentLang no está seteado`);

  const url = `data/${name}.${code}.json`; // skills.es.json / skills.en.json
  console.log(`[data] Fetch -> ${url}`);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`[data] HTTP ${res.status} cargando ${url}`);
  }

  const json = await res.json();
  console.log(`[data] OK -> ${name}.${code}`, json);
  return json;
}
