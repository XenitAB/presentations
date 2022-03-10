# TASK #03 - Deploy a container

- Same as in LAB #01 & LAB #02 with the addition of:
- [Docker](https://docs.docker.com/get-docker/) _v20.10.12_
- [Personal Access Token (PAT) for GitHub](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)

In this lab, Docker version `20.10.12` is used.

## Description

In this lab, you will deploy an [Azure Web App for Containers](https://azure.microsoft.com/en-us/services/app-service/containers/) and [Azure Container Registry](https://azure.microsoft.com/en-us/services/container-registry/) (ACR) using Terraform. You will also create a container of your Node.js application and on commits to your repository push it to ACR using GitHub Actions. When a new container is pushed to ACR, it will trigger a webhook that updates the Azure Web App to load the latest version.

## Lab

This lab expects you to have completed the [LAB #02](02-deployment-iac.md) before this and that you have a Node.js application in the root.

### Terraform

**SCAFFOLDING**

Create a new folder to use with terraform: `terraform-container`

```shell
├── terraform-container
│   ├── main.tf
│   ├── outputs.tf
│   └── variables.tf
```

Now commit the changes:

```shell
git add terraform-container/
git status
git commit -m "terraform-container scaffolding"
git push
```

**VARIABLES**

Now edit the file `terraform-container/variables.tf`:

```terraform
variable "environment" {
  description = "The environment short name"
  type        = string
  default     = "lab"
}

variable "location_long" {
  description = "The location where to place resources"
  type        = string
  default     = "west europe"
}

variable "location" {
  description = "The location short name"
  type        = string
  default     = "we"
}

variable "name" {
  description = "The name to use for the different parts of the deployment"
  type        = string
  default     = "webapp1"
}

variable "container_name" {
  description = "The name of the container that will be deployed to the Azure Web App"
  type        = string
  default     = "azure-lab"
}
```

As before, use something else for the variable `name`.

**WEB APP / AZURE CONTAINER REGISTRY**

Edit the file `terraform-container/main.tf` and add the following:

```terraform
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "2.98.0"
    }
  }
}

provider "azurerm" {
  features {}
}

locals {
  resource_group_name           = "rg-${var.environment}-${var.location}-${var.name}"
  app_service_plan_name         = "asp-${var.environment}-${var.location}-${var.name}"
  app_service_name              = "wa-${var.environment}-${var.location}-${var.name}"
  azure_container_registry_name = "acr${var.environment}${var.location}${var.name}"
}

resource "azurerm_resource_group" "this" {
  name     = local.resource_group_name
  location = var.location_long
}

resource "azurerm_app_service_plan" "this" {
  name                = local.app_service_plan_name
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  kind                = "Linux"
  reserved            = true

  sku {
    tier = "Basic"
    size = "B1"
  }
}

resource "azurerm_app_service" "this" {
  name                = local.app_service_name
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  app_service_plan_id = azurerm_app_service_plan.this.id

  site_config {
    app_command_line = ""
    linux_fx_version = "DOCKER|${azurerm_container_registry.this.login_server}/${var.container_name}:latest"
  }

  identity {
    type = "SystemAssigned"
  }

  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "DOCKER_REGISTRY_SERVER_URL"          = "https://${azurerm_container_registry.this.login_server}"
    "DOCKER_REGISTRY_SERVER_USERNAME"     = azurerm_container_registry.this.admin_username
    "DOCKER_REGISTRY_SERVER_PASSWORD"     = azurerm_container_registry.this.admin_password
    "DOCKER_ENABLE_CI"                    = "TRUE"
    "WEBSITES_PORT"                       = "8080"
    "PORT"                                = "8080"
  }

  lifecycle {
    ignore_changes = [
      site_config[0].linux_fx_version,
    ]
  }
}

resource "azurerm_container_registry" "this" {
  name                = local.azure_container_registry_name
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  sku                 = "Basic"
  admin_enabled       = true
}

resource "azurerm_container_registry_webhook" "this" {
  name                = "webhook${replace(azurerm_app_service.this.name, "-", "")}"
  registry_name       = azurerm_container_registry.this.name
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location

  service_uri = "https://${azurerm_app_service.this.site_credential[0].username}:${azurerm_app_service.this.site_credential[0].password}@${azurerm_app_service.this.name}.scm.azurewebsites.net/docker/hook"
  status      = "enabled"
  scope       = "${var.container_name}:latest"
  actions     = ["push"]
}
```

There's a lot of new things in here, but one completely new thing is [the lifecycle Meta-Argument](the lifecycle Meta-Argument) which tells terraform to ignore changes to a specific property. This is actually not needed in this case because we will use a webhook to tell the Web App to reload a specific container tag (`latest`) but if we were pushing new versions from outside of terraform - we would use this to make sure that terraform doesn't overwrite the new version with what is defined in the configuration.

**RUNNING TERRAFORM**

Like the earlier lab, make sure you are logged in with the Azure CLI and using the correct subscription. Now initialize the terraform state:

```shell
cd terraform-container
terraform init
```

Run plan and verify that your terraform code is correct and that the expected resources are created:

```shell
terraform plan
```

There should now be an output with something like this:

```shell
Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # azurerm_app_service.this will be created
  + resource "azurerm_app_service" "this" {
      + app_service_plan_id               = (known after apply)
      + app_settings                      = (known after apply)
      + client_affinity_enabled           = false
      + client_cert_enabled               = false
      + client_cert_mode                  = (known after apply)
      + custom_domain_verification_id     = (known after apply)
      + default_site_hostname             = (known after apply)
      + enabled                           = true
      + https_only                        = false
      + id                                = (known after apply)
      + key_vault_reference_identity_id   = (known after apply)
      + location                          = "westeurope"
      + name                              = "wa-lab-we-webapp1"
      + outbound_ip_address_list          = (known after apply)
      + outbound_ip_addresses             = (known after apply)
      + possible_outbound_ip_address_list = (known after apply)
      + possible_outbound_ip_addresses    = (known after apply)
      + resource_group_name               = "rg-lab-we-webapp1"
      + site_credential                   = (known after apply)

      + auth_settings {
          + additional_login_params        = (known after apply)
          + allowed_external_redirect_urls = (known after apply)
          + default_provider               = (known after apply)
          + enabled                        = (known after apply)
          + issuer                         = (known after apply)
          + runtime_version                = (known after apply)
          + token_refresh_extension_hours  = (known after apply)
          + token_store_enabled            = (known after apply)
          + unauthenticated_client_action  = (known after apply)

          + active_directory {
              + allowed_audiences = (known after apply)
              + client_id         = (known after apply)
              + client_secret     = (sensitive value)
            }

          + facebook {
              + app_id       = (known after apply)
              + app_secret   = (sensitive value)
              + oauth_scopes = (known after apply)
            }

          + google {
              + client_id     = (known after apply)
              + client_secret = (sensitive value)
              + oauth_scopes  = (known after apply)
            }

          + microsoft {
              + client_id     = (known after apply)
              + client_secret = (sensitive value)
              + oauth_scopes  = (known after apply)
            }

          + twitter {
              + consumer_key    = (known after apply)
              + consumer_secret = (sensitive value)
            }
        }

      + connection_string {
          + name  = (known after apply)
          + type  = (known after apply)
          + value = (sensitive value)
        }

      + identity {
          + principal_id = (known after apply)
          + tenant_id    = (known after apply)
          + type         = "SystemAssigned"
        }

      + logs {
          + detailed_error_messages_enabled = (known after apply)
          + failed_request_tracing_enabled  = (known after apply)

          + application_logs {
              + file_system_level = (known after apply)

              + azure_blob_storage {
                  + level             = (known after apply)
                  + retention_in_days = (known after apply)
                  + sas_url           = (sensitive value)
                }
            }

          + http_logs {
              + azure_blob_storage {
                  + retention_in_days = (known after apply)
                  + sas_url           = (sensitive value)
                }

              + file_system {
                  + retention_in_days = (known after apply)
                  + retention_in_mb   = (known after apply)
                }
            }
        }

      + site_config {
          + acr_use_managed_identity_credentials = false
          + always_on                            = false
          + dotnet_framework_version             = "v4.0"
          + ftps_state                           = (known after apply)
          + http2_enabled                        = false
          + ip_restriction                       = (known after apply)
          + linux_fx_version                     = (known after apply)
          + local_mysql_enabled                  = (known after apply)
          + managed_pipeline_mode                = (known after apply)
          + min_tls_version                      = (known after apply)
          + number_of_workers                    = (known after apply)
          + remote_debugging_enabled             = false
          + remote_debugging_version             = (known after apply)
          + scm_ip_restriction                   = (known after apply)
          + scm_type                             = (known after apply)
          + scm_use_main_ip_restriction          = false
          + vnet_route_all_enabled               = (known after apply)
          + websockets_enabled                   = (known after apply)
          + windows_fx_version                   = (known after apply)

          + cors {
              + allowed_origins     = (known after apply)
              + support_credentials = (known after apply)
            }
        }

      + source_control {
          + branch             = (known after apply)
          + manual_integration = (known after apply)
          + repo_url           = (known after apply)
          + rollback_enabled   = (known after apply)
          + use_mercurial      = (known after apply)
        }

      + storage_account {
          + access_key   = (sensitive value)
          + account_name = (known after apply)
          + mount_path   = (known after apply)
          + name         = (known after apply)
          + share_name   = (known after apply)
          + type         = (known after apply)
        }
    }

  # azurerm_app_service_plan.this will be created
  + resource "azurerm_app_service_plan" "this" {
      + id                           = (known after apply)
      + kind                         = "Linux"
      + location                     = "westeurope"
      + maximum_elastic_worker_count = (known after apply)
      + maximum_number_of_workers    = (known after apply)
      + name                         = "asp-lab-we-webapp1"
      + reserved                     = true
      + resource_group_name          = "rg-lab-we-webapp1"

      + sku {
          + capacity = (known after apply)
          + size     = "B1"
          + tier     = "Basic"
        }
    }

  # azurerm_container_registry.this will be created
  + resource "azurerm_container_registry" "this" {
      + admin_enabled                 = true
      + admin_password                = (sensitive value)
      + admin_username                = (known after apply)
      + encryption                    = (known after apply)
      + georeplication_locations      = (known after apply)
      + georeplications               = (known after apply)
      + id                            = (known after apply)
      + location                      = "westeurope"
      + login_server                  = (known after apply)
      + name                          = "acrlabwewebapp1"
      + network_rule_bypass_option    = "AzureServices"
      + network_rule_set              = (known after apply)
      + public_network_access_enabled = true
      + resource_group_name           = "rg-lab-we-webapp1"
      + retention_policy              = (known after apply)
      + sku                           = "Basic"
      + storage_account_id            = (known after apply)
      + trust_policy                  = (known after apply)
      + zone_redundancy_enabled       = false
    }

  # azurerm_container_registry_webhook.this will be created
  + resource "azurerm_container_registry_webhook" "this" {
      + actions             = [
          + "push",
        ]
      + id                  = (known after apply)
      + location            = "westeurope"
      + name                = "webhookwalabwewebapp1"
      + registry_name       = "acrlabwewebapp1"
      + resource_group_name = "rg-lab-we-webapp1"
      + scope               = "azure-lab:latest"
      + service_uri         = (known after apply)
      + status              = "enabled"
    }

  # azurerm_resource_group.this will be created
  + resource "azurerm_resource_group" "this" {
      + id       = (known after apply)
      + location = "westeurope"
      + name     = "rg-lab-we-webapp1"
    }

Plan: 5 to add, 0 to change, 0 to destroy.

Note: You didn't use the -out option to save this plan, so Terraform can't guarantee to take exactly these actions if you run "terraform apply" now.
```

If everything goes through, run `terraform apply`.

**VERIFY**

Go to the Azure Portal and in the top search bar, search for your resource group (example: `rg-lab-we-webapp1`) and verify that it contains the following resources: (but with your suffix instead of `webapp1`)

- Container registry: `acrlabwewebapp1`
- App Service plan: `asp-lab-we-webapp1`
- App Service: `wa-lab-we-webapp1`
- Container registry webhook: `webhookwalabwewebapp1 (acrlabwewebapp1/webhookwalabwewebapp1)`

The webhook name is a little weird, but that's how they are created by the Azure Portal if done manually so keeping to it - not actually sure it is required. Better safe than sorry.

**COMMIT CHANGES**

Commit the changes you have made:

```shell
cd ..
git add terraform-container/
git status
git commit -m "add web app & container registry"
git push
```

### Container image

We now need to get started with the next step and that is to create a container image and testing it locally.

**CREATING DOCKERFILE**

Create a file named `Dockerfile`:

```Dockerfile
FROM node:lts-buster-slim

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY app.js ./
COPY bin ./bin
COPY public ./public
COPY routes ./routes
COPY views ./views

RUN apt-get update && apt-get install -y \
  tini \
  && rm -rf /var/lib/apt/lists/*

USER node

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD [ "node", "./bin/www" ]
```

You can read more about it here: [Best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

**BUILDING CONTAINER**

Now run the following to build the container:

```shell
docker build . -t acrlabwewebapp1.azurecr.io/azure-lab:latest
```

Make sure to change the name (before `.azurecr.io`) from `acrlabwewebapp1` to the name you have.

You should see an output like this:

```shell
Sending build context to Docker daemon  356.5MB
Step 1/15 : FROM node:lts-buster-slim
lts-buster-slim: Pulling from library/node
15115158dd02: Pull complete
0a3670bd8e93: Pull complete
59583c507ad2: Pull complete
c56d959776a3: Pull complete
579e31ff2961: Pull complete
Digest: sha256:3f34fa94510e16bf619fefb53c9c5d2b11ead626863bdb6b26b49d38d1b56db8
Status: Downloaded newer image for node:lts-buster-slim
 ---> dc3b2ce4c6a8
Step 2/15 : ARG NODE_ENV=production
 ---> Running in ee16ded385ec
Removing intermediate container ee16ded385ec
 ---> abb014482642
Step 3/15 : ENV NODE_ENV=$NODE_ENV
 ---> Running in 462259309fa8
Removing intermediate container 462259309fa8
 ---> c731fdb82bf4
Step 4/15 : WORKDIR /usr/src/app
 ---> Running in 3f2c0e00c226
Removing intermediate container 3f2c0e00c226
 ---> a548971a1e0e
Step 5/15 : COPY package*.json ./
 ---> bac957a73542
Step 6/15 : RUN npm install
 ---> Running in a8968683bf84
npm WARN deprecated core-js@2.6.12: core-js@<3.4 is no longer maintained and not recommended for usage due to the number of issues. Because of the V8 engine whims, feature detection in old core-js versions could cause a slowdown up to 100x even if nothing is polyfilled. Please, upgrade your dependencies to the actual version of core-js.

added 124 packages, and audited 125 packages in 7s

8 packages are looking for funding
  run `npm fund` for details

4 vulnerabilities (2 low, 2 high)

To address issues that do not require attention, run:
  npm audit fix

To address all issues, run:
  npm audit fix --force

Run `npm audit` for details.
npm notice
npm notice New minor version of npm available! 8.3.1 -> 8.5.3
npm notice Changelog: <https://github.com/npm/cli/releases/tag/v8.5.3>
npm notice Run `npm install -g npm@8.5.3` to update!
npm notice
Removing intermediate container a8968683bf84
 ---> 0a74d73c2c9b
Step 7/15 : COPY app.js ./
 ---> 23596abed405
Step 8/15 : COPY bin ./bin
 ---> 427421dae89c
Step 9/15 : COPY public ./public
 ---> d804da5899b5
Step 10/15 : COPY routes ./routes
 ---> f8f4db893e44
Step 11/15 : COPY views ./views
 ---> 971dfaa76b5e
Step 12/15 : RUN apt-get update && apt-get install -y   tini   && rm -rf /var/lib/apt/lists/*
 ---> Running in 4b7d09139d7d
Get:1 http://security.debian.org/debian-security buster/updates InRelease [65.4 kB]
Get:2 http://deb.debian.org/debian buster InRelease [122 kB]
Get:3 http://deb.debian.org/debian buster-updates InRelease [51.9 kB]
Get:4 http://security.debian.org/debian-security buster/updates/main amd64 Packages [317 kB]
Get:5 http://deb.debian.org/debian buster/main amd64 Packages [7906 kB]
Get:6 http://deb.debian.org/debian buster-updates/main amd64 Packages [8792 B]
Fetched 8471 kB in 1s (6278 kB/s)
Reading package lists...
Reading package lists...
Building dependency tree...
Reading state information...
The following package was automatically installed and is no longer required:
  lsb-base
Use 'apt autoremove' to remove it.
The following NEW packages will be installed:
  tini
0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.
Need to get 247 kB of archives.
After this operation, 731 kB of additional disk space will be used.
Get:1 http://deb.debian.org/debian buster/main amd64 tini amd64 0.18.0-1 [247 kB]
debconf: delaying package configuration, since apt-utils is not installed
Fetched 247 kB in 0s (2928 kB/s)
Selecting previously unselected package tini.
(Reading database ... 6469 files and directories currently installed.)
Preparing to unpack .../tini_0.18.0-1_amd64.deb ...
Unpacking tini (0.18.0-1) ...
Setting up tini (0.18.0-1) ...
Removing intermediate container 4b7d09139d7d
 ---> 52b5198e8a56
Step 13/15 : USER node
 ---> Running in 51d5a7d33aea
Removing intermediate container 51d5a7d33aea
 ---> e8568d478407
Step 14/15 : ENTRYPOINT ["/usr/bin/tini", "--"]
 ---> Running in 613467af7360
Removing intermediate container 613467af7360
 ---> a0528d8cb771
Step 15/15 : CMD [ "node", "./bin/www" ]
 ---> Running in 8bf69b913e3d
Removing intermediate container 8bf69b913e3d
 ---> be832b2edce0
Successfully built be832b2edce0
Successfully tagged acrlabwewebapp1.azurecr.io/azure-lab:latest
```

Please note that you have **NOT** pushed this image to Azure Container Registry, you have only created a `tag` locally.

It is possible create it using another tag and then add another user `docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]`.

**RUNNING THE CONTAINER LOCALLY**

Start the container using:

```shell
docker run --rm -it -p 3000:3000 acrlabwewebapp1.azurecr.io/azure-lab:latest
```

Browse [localhost:3000](http://localhost:3000) and verify that it works and you should see an output from the container. Press `CTRL+C` to exit from the container.

If you want to test using another port, you will need to tell Node.js what port to use by passing the environment variable `PORT` to the container:

```shell
docker run --rm -it -p 8080:8080 -e PORT=8080 acrlabwewebapp1.azurecr.io/azure-lab:latest
```

Now you should be able to browse [localhost:8080](http://localhost:8080) instead. Exit using `CTRL+C`.

**PUSHING THE CONTAINER MANUALLY**

To push the container to the container registry, you first need to login to the container registry:

```shell
az acr login --name acrlabwewebapp1
```

Remember to change the name of the container registry to the one you are using.

Now push the container:

```shell
docker push acrlabwewebapp1.azurecr.io/azure-lab:latest
```

Since we are using a really small Web App, it may take a few minutes for it to catch up to the container image. Try browsing the Web App (go to `resource group` -> `web app` -> press `browse`) and see if it works. If you have waited a few minutes and it still doesn't work, try restarting the web app.

You can go into the webhook and you should see that a push was made. In the web app, go to Deployment Center (not `Classic`) and you should be able to see the container logs and the container image being downloaded / started.

**COMMIT**

```shell
git add Dockerfile
git status
git commit -m "add Dockerfile"
git push
```

### GitHub

**PAT SCOPES**

The following scopes will be needed for your Personal Access Token:

- `repo`
- `workflow`

**EXTERNAL TERRAFORM VARIABLES**

Before we begin, we will need three variables in our shell. One of them will be _secret_ and needs to be handled with care (like not showing up in your cli history).

You can read secrets without them showing up in the history using:

Linux / Mac:

```shell
read -s SECRET_VARIABLE
```

Windows (Powershell):

```powershell
$SECRET_VARIABLE = Read-Host -MaskInput
```

We need to create three variables with the names:

- `TF_VAR_github_owner` (your GitHub username)
- `TF_VAR_github_token` (your GitHub PAT, secret)
- `TF_VAR_github_repository` (your GitHub repository, without username)

Create (and export) them using:

Linux / Mac:

```shell
read -s github_pat
<enter secret>
export TF_VAR_github_owner=<username>
export TF_VAR_github_token=${github_pat}
export TF_VAR_github_repository=<repository>
```

Windows (Powershell):

```powershell
$github_pat = Read-Host -MaskInput
$Env:TF_VAR_github_owner = "<username>"
$Env:TF_VAR_github_token = ${github_pat}
$Env:TF_VAR_github_repository = "<repository>"
```

Please note that these will only exist in the current shell. If you start a new shell you will have to do it again.

All environment variables starting with the prefix `TF_VAR_` will be available inside of terraform to use, without the `TF_VAR_` prefix. As an example, `TF_VAR_github_owner` will be available in terraform as `github_owner`.

**GITHUB PROVIDER**

First of all, we need to add the new variables to the file `terraform-container/variables.tf`: (add it to the bottom)

```terraform
variable "github_repository" {
  description = "The GitHub repository to use"
  type        = string
}

variable "github_owner" {
  description = "The GitHub username to use (Use the following environment variable to inject: TF_VAR_github_owner)"
  type        = string
  sensitive   = true
}

variable "github_token" {
  description = "The GitHub token to use (Use the following environment variable to inject: TF_VAR_github_token)"
  type        = string
  sensitive   = true
}
```

We then need to add the GitHub provider to the file `terraform-container/main.tf`: (replace the current `terraform` block)

```terraform
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "2.45.1"
    }
    github = {
      source  = "integrations/github"
      version = "4.20.1"
    }
  }
}
```

Then we need to tell the GitHub provider what username and PAT to use, by adding this to the file `terraform-container/main.tf`: (add it below the `provider "azurerm"` block)

```terraform
provider "github" {
  token = var.github_token
  owner = var.github_owner
}
```

And the last step will be adding some GitHub Actions secrets from Azure Container Registry using terraform. Add the following to the bottom of the file `terraform-container/main.tf`

```terraform
resource "github_actions_secret" "acr_username" {
  repository      = var.github_repository
  secret_name     = "ACR_USERNAME"
  plaintext_value = azurerm_container_registry.this.admin_username
}

resource "github_actions_secret" "acr_password" {
  repository      = var.github_repository
  secret_name     = "ACR_PASSWORD"
  plaintext_value = azurerm_container_registry.this.admin_password
}

resource "github_actions_secret" "acr_hostname" {
  repository      = var.github_repository
  secret_name     = "ACR_HOSTNAME"
  plaintext_value = azurerm_container_registry.this.login_server
}

resource "github_actions_secret" "container_name" {
  repository      = var.github_repository
  secret_name     = "CONTAINER_NAME"
  plaintext_value = var.container_name
}
```

When you have added a new provider to terraform, you need to run `terraform init` again. After `init`, run `terraform plan` and verify that it looks OK and then run `terraform apply`.

```shell
cd terraform-container
terraform init
terraform plan
terraform apply
cd ..
```

When you have applied this, go to your GitHub repository (using your browser) and go to `Settings` -> `Secrets` and verify that you see the following:

- `ACR_HOSTNAME`
- `ACR_PASSWORD`
- `ACR_USERNAME`
- `CONTAINER_NAME`

**COMMIT**

```shell
git add terraform-container/
git status
git commit -m "add GitHub terraform provider"
git push
```

### GitHub Actions

The last step will be to create a GitHub Action that builds and pushes the container to Azure Container Registry when changes are made.

Add the file `.github/workflows/push-container.yaml`:

```yaml
name: Push container to Azure Container Registry

on: push

jobs:
  push-container:
    runs-on: ubuntu-latest
    steps:
      - name: Clone repo
        uses: actions/checkout@v2
      - name: Prepare
        id: prep
        run: |
          VERSION=sha-${GITHUB_SHA::8}
          if [[ $GITHUB_REF == refs/tags/* ]]; then
            VERSION=${GITHUB_REF/refs\/tags\//}
          fi
          echo ::set-output name=VERSION::${VERSION}
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1
      - name: Login to GitHub Container Registry
        uses: docker/login-action@v1
        with:
          registry: ${{ secrets.ACR_HOSTNAME }}
          username: ${{ secrets.ACR_USERNAME }}
          password: ${{ secrets.ACR_PASSWORD }}
      - name: Build and push container
        uses: docker/build-push-action@v2
        with:
          push: true
          context: .
          file: ./Dockerfile
          tags: |
            ${{ secrets.ACR_HOSTNAME }}/${{ secrets.CONTAINER_NAME }}:${{ steps.prep.outputs.VERSION }}
            ${{ secrets.ACR_HOSTNAME }}/${{ secrets.CONTAINER_NAME }}:latest
```

The secrets we created with terraform can be seen here being used in the GitHub Action.

Commit the GitHub Action:

```shell
git add .github/workflows/push-container.yaml
git status
git commit -m "add github workflow"
git push
```

Update the file `routes/index.js` and change the title:

```javascript
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "AzureContainerLab" });
});
```

Now commit the changes: (make sure you are in the root of the repository and that status shows `routes/index.js`)

```shell
git add routes/index.js
git status
git commit -m "update title"
git push
```

Now browse the web app and verify that you see the change (may take a few minutes).

### Cleaning up

Now use terraform to remove everything:

```terraform
cd terraform-container
terraform destroy
```

## LAB DONE!

Great work! :-D

# Go back

Click [here](../README.md) to go back to lab overview.
