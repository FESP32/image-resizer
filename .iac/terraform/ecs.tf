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

# resource "aws_ecs_task_definition" "cluster_task" {
#   family                    = "${var.aws_task_definition_name}"
#   container_definitions     = <<DEFINITION
# [
#   {
#     "name": "${var.aws_task_definition_name}",
#     "image": "${aws_ecr_repository.image-resizer.repository_url}",
#     "essential": true,
#     "portMappings": [
#       {
#         "containerPort": 3000,
#         "hostPort": 80
#       }
#     ],
#     "memory": 512,
#     "cpu": 256,
#     "networkMode": "awsvpc"
#   }
# ]
#   DEFINITION
#   requires_compatibilities  = ["EC2"]
#   network_mode              = "awsvpc"
#   memory                    = 512
#   execution_role_arn        = aws_iam_role.ecsTaskExecutionRole.arn
#   cpu                       = 256
# }

resource "aws_ecs_cluster" "main_cluster" {
  name = var.cluster_name
}

# resource "aws_ecs_service" "my_first_services" {
#   name              = "gft-test-first-services"
#   cluster           = aws_ecs_cluster.main_cluster.id
#   task_definition   = aws_ecs_task_definition.cluster_task.arn
#   launch_type       = "EC2"
#   scheduling_strategy = "REPLICA"
#   desired_count     = 1

#   network_configuration {
#     subnets          = [aws_default_subnet.ecs_az1.id]
#     assign_public_ip = false
#   }
# }