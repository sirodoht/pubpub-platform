locals {
  db_user = aws_db_instance.core_postgres.username
  db_name = aws_db_instance.core_postgres.db_name
  db_host = aws_db_instance.core_postgres.address
  db_sslmode = "require"
}

output "secrets" {
  value = {
    api_key = aws_secretsmanager_secret.api_key.id
    rds_db_password = aws_secretsmanager_secret.rds_db_password.id
    jwt_secret = aws_secretsmanager_secret.jwt_secret.id
    sentry_auth_token = aws_secretsmanager_secret.sentry_auth_token.id
    supabase_service_role_key = aws_secretsmanager_secret.supabase_service_role_key.id
    supabase_webhooks_api_key = aws_secretsmanager_secret.supabase_webhooks_api_key.id
  }
}

output "rds_connection_string_sans_password" {
  value = "postgresql://${local.db_user}@${local.db_host}:5432/${local.db_name}?sslmode=${local.db_sslmode}"
}

output "rds_connection_components" {
  value = {
    user = local.db_user
    database = local.db_name
    host = local.db_host
    port = "5432"
    sslmode = local.db_sslmode
    id = aws_db_instance.core_postgres.id
  }
}
