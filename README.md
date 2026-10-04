# Japan-Trainer

Familien-Lernapp für Japanisch bis zur Reise im Februar 2027. Läuft auf iPhone, iPad und Mac als Web-App vom Home-Screen.

## Auf ein Gerät bringen
1. Die Seite in Safari öffnen.
2. Teilen-Knopf → **Zum Home-Bildschirm**.
3. Einmal mit dem Familien-Login anmelden. Danach wählt jeder nur noch sein Profil.

Für die beste Aussprache auf iPhone/iPad: Einstellungen › Bedienungshilfen › Gesprochene Inhalte › Stimmen › Japanisch › **Kyoko (Erweitert)** laden.

## Aufbau
- `index.html` - die komplette App (Inhalte, Lernlogik, Oberfläche)
- `supabase.js` - Bibliothek für den Familien-Sync (supabase-js 2.117.2)
- `sw.js` - Offline-Speicher, damit die App auch ohne Netz startet
- `manifest.webmanifest`, `icons/` - Home-Screen-Symbol

## Daten
Der Lernstand liegt pro Gerät lokal und wird über Supabase (Tabelle `progress`, Region Frankfurt) zwischen den Geräten abgeglichen.
Lesen und schreiben kann nur der Familien-Login (Row-Level-Security). Der Publishable Key in `index.html` ist für den Browser gedacht und gibt ohne Login keinen Zugriff.

## Aussprache-Aufnahmen
iOS gibt heruntergeladene „Erweitert“-Stimmen nicht an Web-Apps weiter. Deshalb spielt die App vorab erzeugte Aufnahmen aus `audio/` ab und nutzt die Gerätestimme nur als Ersatz.
1. Nach neuen Inhalten: `node tools/build-texts.js` aktualisiert `audio/texts.tsv`.
2. Auf dem Mac im Terminal: `bash <(curl -fsSL https://x2snka.github.io/Japan-trainer/tools/make-audio.sh)` erzeugt fehlende Aufnahmen in `~/Japan-Audio/japan-audio.zip`.
3. Die `.m4a`-Dateien nach `audio/` legen und `node tools/build-texts.js` erneut ausführen (aktualisiert `audio/index.json`).
