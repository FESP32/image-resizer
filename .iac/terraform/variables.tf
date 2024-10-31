variable "bucket_name" {
 type = string
 default = "image-resizer-bucket"
 description = "prefix for the bucket"
}

variable "bucket_policy_name" {
 type = string
 default = "image-resizer-bucket-policy"
 description = "name for user"
}

variable "acr_name" {
 type = string
 default = "image-resizer-registry"
 description = "name for ACR registry"
}

variable "user_name" {
 type = string
 default = "image-resizer-user"
 description = "name for user"
}

variable "task_definition_name" {
 type = string
 default = "image-resizer-task"
 description = "name for task defintion"
}

variable "cluster_name" {
 type = string
 default = "image-resizer-cluster"
 description = "name for cluster"
}

variable "ecs_role_name" {
 type = string
 default = "image-resizer-ecs-role"
 description = "name for cluster role"
}

variable "aws_region" {
 type = string
 default = "us-east-1"
 description = "name for user"
}


