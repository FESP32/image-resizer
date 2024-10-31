resource "aws_ecr_repository" "image-resizer" {
  name                 = var.acr_name
  image_tag_mutability = "MUTABLE"
  force_delete         = true
  image_scanning_configuration {
    scan_on_push = true
  }
}


resource "aws_default_vpc" "ecs-vpc" {
  tags = {
    Name = "ECS-VPC"
  }
}

resource "aws_default_subnet" "ecs_az1" {
  availability_zone = "us-east-1a"

  tags = {
    Name = "Default subnet for us-east-1a"
  }
}

resource "aws_iam_role" "ecsTaskExecutionRole" {
  name               = var.ecs_role_name
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}
resource "aws_ecs_cluster" "main_cluster" {
  name = var.cluster_name
}
