locals {
  db_user = aws_db_instance.core_postgres.username
  db_name = aws_db_instance.core_postgres.db_name
  db_host = aws_db_instance.core_postgres.address
  db_sslmode = "require"
}

output "api_key_secret_id" {
  value = aws_secretsmanager_secret.api_key.id
}

output "rds_db_password_id" {
  value = aws_secretsmanager_secret.rds_db_password.id
}

output "rds_connection_string_sans_password" {
  value = "postgresql://${local.db_user}@${local.db_host}:5432/${local.db_name}?sslmode=${local.db_sslmode}"
}
