resource "random_string" "bucket_suffix" {
  length  = 6 
  special = false
  upper   = false 
}

resource "aws_s3_bucket" "main_bucket" {
  bucket = "${var.bucket_name}-${random_string.bucket_suffix.result}"
  force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "main_bucket" {
  bucket = aws_s3_bucket.main_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = "${aws_s3_bucket.main_bucket.id}"
   policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = "*"
        Action = [
          "s3:GetObject"
        ]
        Resource = [
          "${aws_s3_bucket.main_bucket.arn}/*"
        ]
      } 
    ]
  })
}
