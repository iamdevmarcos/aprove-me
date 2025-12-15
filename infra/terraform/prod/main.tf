terraform {
  required_version = ">= 1.5.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

resource "google_compute_network" "prod_vpc" {
  name                    = "${var.project_prefix}-prod-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "prod_subnet" {
  name          = "${var.project_prefix}-prod-subnet"
  ip_cidr_range = "10.10.0.0/24"
  region        = var.region
  network       = google_compute_network.prod_vpc.id
}

resource "google_artifact_registry_repository" "docker_repo" {
  location      = var.region
  repository_id = "${var.project_prefix}-repo"
  description   = "Docker images for aproveme prod environment"
  format        = "DOCKER"
}

resource "google_compute_firewall" "prod_http" {
  name    = "${var.project_prefix}-prod-http"
  network = google_compute_network.prod_vpc.name

  allow {
    protocol = "tcp"
    ports    = ["80", "3000", "3001"]
  }

  source_ranges = ["0.0.0.0/0"]
}

resource "google_compute_firewall" "prod_ssh" {
  name    = "${var.project_prefix}-prod-ssh"
  network = google_compute_network.prod_vpc.name

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = ["0.0.0.0/0"]
}

resource "google_compute_instance" "prod_vm" {
  name         = "${var.project_prefix}-prod-vm"
  machine_type = var.machine_type
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "projects/debian-cloud/global/images/family/debian-12"
      size  = 30
    }
  }

  network_interface {
    network    = google_compute_network.prod_vpc.id
    subnetwork = google_compute_subnetwork.prod_subnet.id

    access_config {
    }
  }

  metadata = {
    startup-script = <<-EOF
      #!/bin/bash
      set -e

      apt-get update -y

      apt-get install -y ca-certificates curl gnupg lsb-release git

      install -m 0755 -d /etc/apt/keyrings
      curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
      chmod a+r /etc/apt/keyrings/docker.gpg
      echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
        $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
      apt-get update -y
      apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

      systemctl enable docker
      systemctl start docker

      echo "Docker instalado."
    EOF
  }

  tags = ["aproveme-prod"]
}

output "prod_vm_external_ip" {
  value       = google_compute_instance.prod_vm.network_interface[0].access_config[0].nat_ip
}

output "docker_repo_uri" {
  value       = google_artifact_registry_repository.docker_repo.repository_id
}


