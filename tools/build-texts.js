// Erzeugt audio/texts.tsv (hash<TAB>text) aus den Inhalten in index.html.
// Aufruf: node tools/build-texts.js
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/g)[0].replace(/<\/?script>/g, '');
const content = script.slice(script.indexOf('const TRIP_START'), script.indexOf('/* =========================================================================\n   APP'));
const {ITEMS, PROFILES} = new Function(content + '\nreturn {ITEMS, PROFILES};')();
const norm = t => String(t).replace(/[\s　]+/g, '');
const key = t => { let h = 0x811c9dc5; const s = norm(t); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ('0000000' + h.toString(16)).slice(-8); };
const texts = new Set();
ITEMS.forEach(i => {
  if (/\{kana\}/.test(i.jp)) PROFILES.forEach(p => texts.add(i.jp.replace(/\{kana\}/g, p.kana)));
  else texts.add(i.jp);
});
['こんにちは。よろしく おねがいします。', 'すみません、ラーメンを ひとつ おねがいします。', 'こんにちは'].forEach(t => texts.add(t));
const rows = [...texts].map(t => key(t) + '\t' + norm(t));
fs.writeFileSync(path.join(root, 'audio', 'texts.tsv'), rows.join('\n') + '\n');
const have = fs.readdirSync(path.join(root, 'audio')).filter(f => f.endsWith('.m4a')).map(f => f.slice(0, -4));
fs.writeFileSync(path.join(root, 'audio', 'index.json'), JSON.stringify(have.sort()));
console.log(rows.length + ' Texte, ' + have.length + ' Aufnahmen vorhanden');
