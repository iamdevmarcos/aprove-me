variable "project_id" {
  type = string
}

variable "project_prefix" {
  type    = string
  default = "aproveme"
}

variable "region" {
  type    = string
  default = "us-central1"
}

variable "zone" {
  type    = string
  default = "us-central1-a"
}

variable "machine_type" {
  type    = string
  default = "e2-micro"
}
