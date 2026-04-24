#!/bin/bash

# Configurações
CONTAINER="scheduling_db_prod"
DB_USER="user_admin"
DB_NAME="scheduling_system"
BACKUP_DIR="$(dirname "$0")/backups"
RETENTION_DAYS=30
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Iniciando backup..."

docker exec "$CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "[$(date)] Backup salvo em: $BACKUP_FILE"
else
  echo "[$(date)] ERRO: falha ao gerar o backup." >&2
  exit 1
fi

# Remove backups mais antigos que RETENTION_DAYS dias
find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
echo "[$(date)] Backups com mais de $RETENTION_DAYS dias removidos."
