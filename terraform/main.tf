terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_security_group" "allow_http" {
  name        = "allow_http"
  description = "Allow inbound HTTP traffic"

  ingress {
    description = "HTTP from anywhere"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "allow_ssh" {
  name        = "allow_ssh"
  description = "Allow inbound SSH"

  ingress {
    description = "SSH from anywhere"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group_rule" "allow_all_outbound" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.allow_http.id
}

output "security_group_id" {
  value       = aws_security_group.allow_http.id
  description = "The ID of the security group"
}

output "security_group_rule_id" {
  value       = aws_security_group_rule.allow_all_outbound.id
  description = "The ID of the outbound security group rule"
}

resource "aws_key_pair" "terraform_ec2_key" {
	key_name = "terraform_ec2_key"
	public_key = "${file("terraform_ec2_key.pub")}"
}

resource "aws_instance" "app_server" {
  ami           = "ami-04b70fa74e45c3917"
  instance_type = "t3.nano"
  key_name = "terraform_ec2_key"
  vpc_security_group_ids = [
    aws_security_group.allow_http.id,
    aws_security_group.allow_ssh.id
  ]

  tags = {
    Name = "OnlineFPSAppServerInstance"
  }
}
