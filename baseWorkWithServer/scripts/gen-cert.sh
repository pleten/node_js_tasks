#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CERT_DIR="$ROOT_DIR/cert"
KEY_FILE="$CERT_DIR/localhost-key.pem"
CRT_FILE="$CERT_DIR/localhost.pem"
ENV_FILE="$ROOT_DIR/.env"

mkdir -p "$CERT_DIR"

# ── 1. Генеруємо пару, якщо її немає ────────────────────────────────────────────
if [[ ! -f "$KEY_FILE" || ! -f "$CRT_FILE" ]]; then
  echo "🔏  Generating self-signed cert..."
  openssl req -x509 -newkey rsa:2048 -nodes \
    -keyout "$KEY_FILE" \
    -out    "$CRT_FILE" \
    -days   365 \
    -subj   "/CN=localhost"
  echo "✅  Certs saved to $CERT_DIR"
fi

# ── 2. Готуємо .env  ────────────────────────────────────────────────────────────
touch "$ENV_FILE"

# portable sed -i: macOS → '' , Linux → '' пропускаємо
sed_replace () {
  local pattern=$1; shift
  if sed --version >/dev/null 2>&1; then
    sed -i -e "$pattern" "$ENV_FILE"        # GNU sed
  else
    sed -i '' -e "$pattern" "$ENV_FILE"     # BSD/macOS sed
  fi
}

# прибираємо старі (можливо «порожні») рядки SSL_KEY / SSL_CERT
sed_replace '/^SSL_KEY[[:space:]]*=.*/d'
sed_replace '/^SSL_CERT[[:space:]]*=.*/d'

# додаємо \n у кінець, якщо його немає
[[ -s "$ENV_FILE" && $(tail -c1 "$ENV_FILE") != "" ]] && echo >> "$ENV_FILE"

# записуємо актуальні шляхи
{
  echo "SSL_KEY=$KEY_FILE"
  echo "SSL_CERT=$CRT_FILE"
} >> "$ENV_FILE"

echo "📝  .env contains:"
grep -E '^SSL_(KEY|CERT)=' "$ENV_FILE"