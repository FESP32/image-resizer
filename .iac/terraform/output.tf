output "access_key_id" {
  value = aws_iam_access_key.s3_user_access_key.id
  sensitive = true
}

output "secret_access_key" {
  value = aws_iam_access_key.s3_user_access_key.secret
  sensitive = true
}

output "bucket_arn" {
  value = aws_s3_bucket.main_bucket.arn
}

output "ecr_image" {
  value = "${aws_ecr_repository.image-resizer.repository_url}:latest"
}