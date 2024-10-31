resource "aws_iam_user" "execution_user" {
  name = "${var.user_name}"
}

resource "aws_iam_policy" "s3_bucket_policy" {
  name        = "${var.bucket_policy_name}"
  description = "Policy to allow access to a specific S3 bucket"
  policy      = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket"
        ]
        Resource = [
          "${aws_s3_bucket.main_bucket.arn}",
          "${aws_s3_bucket.main_bucket.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_user_policy_attachment" "s3_user_policy_attachment" {
  user       = aws_iam_user.execution_user.name
  policy_arn = aws_iam_policy.s3_bucket_policy.arn
}

resource "aws_iam_access_key" "s3_user_access_key" {
  user = aws_iam_user.execution_user.name
}