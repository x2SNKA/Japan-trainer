#!/bin/bash
# Japan-Trainer: Aussprache-Dateien mit der Mac-Stimme "Kyoko (Erweitert)" erzeugen.
# Aufruf im Terminal:  bash <(curl -fsSL https://x2snka.github.io/Japan-trainer/tools/make-audio.sh)
set -e
BASE="https://x2snka.github.io/Japan-trainer"
OUT="$HOME/Japan-Audio"
mkdir -p "$OUT/files"

VOICE=$(say -v '?' | grep 'ja_JP' | grep -Ei 'premium|enhanced|erweitert' | head -1 | sed -E 's/[[:space:]]{2,}.*//')
if [ -z "$VOICE" ]; then
  echo ""
  echo "Keine erweiterte japanische Stimme auf diesem Mac gefunden."
  echo "Bitte laden: Systemeinstellungen > Bedienungshilfen > Gesprochene Inhalte >"
  echo "Systemstimme > Stimmen verwalten > Japanisch > Kyoko (Erweitert). Danach erneut starten."
  exit 1
fi
echo "Stimme: $VOICE"

curl -fsSL "$BASE/audio/texts.tsv" -o "$OUT/texts.tsv"
total=$(wc -l < "$OUT/texts.tsv" | tr -d ' ')
n=0; made=0
while IFS=$'\t' read -r key text; do
  [ -z "$key" ] && continue
  n=$((n+1))
  if [ ! -f "$OUT/files/$key.m4a" ]; then
    say -v "$VOICE" -o "$OUT/files/$key.aiff" "$text"
    afconvert -f m4af -d aac "$OUT/files/$key.aiff" "$OUT/files/$key.m4a"
    rm -f "$OUT/files/$key.aiff"
    made=$((made+1))
  fi
  printf "\r%s / %s" "$n" "$total"
done < "$OUT/texts.tsv"
echo ""
cd "$OUT/files" && rm -f "$OUT/japan-audio.zip" && zip -q "$OUT/japan-audio.zip" *.m4a
echo "Fertig: $made neue Aufnahmen. Datei: $OUT/japan-audio.zip"
