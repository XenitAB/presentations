# LAB #02 - Deployment using IaC

## Pre-requisites

- Same as in LAB #01 with the addition of:
- [GitHub Account](https://github.com/join)
- [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli)

In this lab, terraform version `0.14.5` is used.

## Description

In this lab, you will deploy a web app using Infrastructure as Code with Terraform as well as configuring the web app to use a GitHub repository for application deployment.

### Creating the repository

Login to GitHub and create a new public repository. Create it on your personal account and not your organization. I called it: `simongottschlag/cloud-and-scalability-lab`

I added a README file when creating it, as well as a `.gitignore` with the Terraform template.

Now clone the repository to your local computer:

```shell
git clone git@github.com:<username>/<repo name>.git
```

In the above case I use SSH and I have already uploaded an SSH key to my GitHub account. Read more here: [Connecting to GitHub with SSH](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh)

Open the newly cloned repository with VS Code.

### Scaffolding

Everything in here is expected to be run in the newly cloned directory.

**GIT IGNORE**

Append the contents of [Node.gitignore](https://github.com/github/gitignore/blob/master/Node.gitignore) to your .gitignore and save.

```shell
git add .gitignore
git status
git commit -m "Add node.js ignore settings"
git push
```

**TERRAFORM**

Create the folder `terraform` in the root and the following files:

```shell
└── terraform
    ├── main.tf
    ├── outputs.tf
    └── variables.tf
```

**NODE.JS**

Create the scaffolding for node:

```shell
npx express-generator . --view pug
```

Good to know: If you place your node code in a sub-directory, you need to configure a lot more to get it working out-of-the box. More info [here](https://github.com/projectkudu/kudu/wiki/Customizing-deployments).

**FILES**

You should now have a folder and file structure like this in your repository:

```shell
├── app.js
├── bin
│   └── www
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── README.md
├── routes
│   ├── index.js
│   └── users.js
├── terraform
│   ├── main.tf
│   ├── outputs.tf
│   └── variables.tf
└── views
    ├── error.pug
    ├── index.pug
    └── layout.pug
```

**COMMIT**

Commit the terraform files:

```shell
git add terraform
git status
git commit -m "terraform scaffolding"
git push
```

Commit the node files:

```shell
git add .
git status
git commit -m "node scaffolding"
git push
```

**NOTES**

Be really careful when commiting and pushing to git, make sure to never **ever** commit secrets. If you ever do it by mistake, you should change that secret **DIRECTLY**. If it's a secret for an organization, you should own up to your mistake and talk to your manager to make sure it's handled the right way.

### Terraform

Terraform is a tool for building, changing, and versioning infrastructure safely and efficiently. Terraform can manage existing and popular service providers as well as custom in-house solutions. Read more about it here: [Introduction to Terraform](https://www.terraform.io/intro/index.html)

If you want to have som highlighting in the code, you can use the following VS Code extension: [4ops.terraform](https://marketplace.visualstudio.com/items?itemName=4ops.terraform) (there are others, but this one is small and easy to use)

**GIT BRANCH**

Create a git branch for the work you will be doing for terraform:

```shell
git checkout -b feature/initial-terraform-code
```

**VARIABLES**

More info about variables: [Input Variables](https://www.terraform.io/docs/language/values/variables.html)

Open `terraform/variables.tf` and create a few common variables to use:

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
```

Make sure to change the `name` variable according to the first lab.

**MAIN**

Open the file `terraform/main.tf` and add the following:

```terraform
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "2.45.1"
    }
  }
}

provider "azurerm" {
  features {}
}

locals {
  resource_group_name = "rg-${var.environment}-${var.location}-${var.name}"
}

resource "azurerm_resource_group" "this" {
  name     = local.resource_group_name
  location = var.location_long
}
```

You can find more information about the above configuration here:

- [required_providers](https://www.terraform.io/docs/language/providers/requirements.html)
- [provider azurerm](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [locals](https://www.terraform.io/docs/language/values/locals.html)
- [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group)

There are extensions to handle formatting as well, but if you don't have them you can always run the following command to format the terraform files: `terraform fmt terraform/`

**INITIALIZE**

Before we actually use terraform with Azure, we need to verify that we are logged in with the Azure CLI and that we are working with the correct subscription.

Make sure all files are saved.

```shell
az login
az account show
az account set --subscription "Visual Studio Enterprise"
```

The [init](https://www.terraform.io/docs/cli/commands/init.html) command is used to initialize a working directory containing Terraform configuration files.

```shell
cd terraform
terraform init
```

The folder structure in terraform should now look something like this:

```terraform
├── .terraform
│   └── providers
│       └── registry.terraform.io
│           └── hashicorp
│               └── azurerm
│                   └── 2.45.1
│                       └── darwin_amd64
│                           └── terraform-provider-azurerm_v2.45.1_x5
├── .terraform.lock.hcl
├── main.tf
├── outputs.tf
└── variables.tf
```

Make sure that the `.terraform` is ignored by `.gitignore`: `git check-ignore -v .terraform/*`

You should see something like: `.gitignore:2:**/.terraform/*    .terraform/providers`

**PLAN**

The [plan](https://www.terraform.io/docs/cli/commands/plan.html) command is used to create an execution plan. Terraform performs a refresh, unless explicitly disabled, and then determines what actions are necessary to achieve the desired state specified in the configuration files.

```shell
terraform plan
```

You should see an output like this:

```shell
An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # azurerm_resource_group.this will be created
  + resource "azurerm_resource_group" "this" {
      + id       = (known after apply)
      + location = "westeurope"
      + name     = "rg-lab-we-webapp1"
    }

Plan: 1 to add, 0 to change, 0 to destroy.

------------------------------------------------------------------------

Note: You didn't specify an "-out" parameter to save this plan, so Terraform
can't guarantee that exactly these actions will be performed if
"terraform apply" is subsequently run.
```

**APPLY**

The [apply](https://www.terraform.io/docs/cli/commands/apply.html) command is used to apply the changes required to reach the desired state of the configuration, or the pre-determined set of actions generated by a terraform plan execution plan.

Run the apply command:

```shell
terraform apply
```

You should see something like the following in the output and be asked to write `yes` (this can be skipped if you add `-auto-approve`, but be careful with that):

```shell
An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # azurerm_resource_group.this will be created
  + resource "azurerm_resource_group" "this" {
      + id       = (known after apply)
      + location = "westeurope"
      + name     = "rg-lab-we-webapp1"
    }

Plan: 1 to add, 0 to change, 0 to destroy.

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: 
```

When you've written `yes` you should see an output like this:

```shell
azurerm_resource_group.this: Creating...
azurerm_resource_group.this: Creation complete after 1s [id=/subscriptions/<subscription_uuid>/resourceGroups/rg-lab-we-webapp1]

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
```

#### Creating the web app

**TERRAFORM**

Update your `locals {}` to reflect the new names:

```terraform
locals {
  resource_group_name   = "rg-${var.environment}-${var.location}-${var.name}"
  app_service_plan_name = "asp-${var.environment}-${var.location}-${var.name}"
  app_service_name      = "wa-${var.environment}-${var.location}-${var.name}"
}
``` 

Create an App Service Plan and an App Service:

```terraform
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
    linux_fx_version = "NODE|14-lts"
  }
}
```

**CONTINUOUS DEPLOYMENT**

It is possible to point the App Service to a GitHub repository using terraform. I've had a lot of issues with the App Service completing the configuration gracefully when doing it and to save time during the lab I've chosen to enable it using the portal or Azure CLI.

If you want to try (I recommend you cancelling it if nothing happens in 10 minutes), you can use the following:

```terraform
resource "azurerm_app_service" "this" {
  name                = local.app_service_name
  location            = azurerm_resource_group.this.location
  resource_group_name = azurerm_resource_group.this.name
  app_service_plan_id = azurerm_app_service_plan.this.id

  site_config {
    linux_fx_version = "NODE|14-lts"
  }

  source_control {
    repo_url           = "https://github.com/<org>/<repo>"
    branch             = "<branch>"
  }
}
``` 

Enable it using the Azure Portal:

- Search for the App Service name (example: `wa-lab-we-webapp1`) in the top search bar
- Press `Deployment Center`
- Continuous Deployment (CI / CD) -> Select `GitHub`
- You may have to authorize Azure Portal to access your GitHub at this stage
- Press `Continue` at the bottom
- Build provider -> Select `App Service build service`
- Press `Continue` at the bottom
- Configure Code -> Organization: `<org / username>`
- Configure Code -> Repository: `<repo name>`
- Configure Code -> Branch: `main`
- Press `Continue` at the bottom -> Press `Finish`

Enable it using Azure CLI:

```shell
az webapp deployment source config --resource-group rg-lab-we-webapp1 --name wa-lab-we-webapp1 --repo-url https://github.com/<org / username>/<repo name> --branch main
```

**VALIDATION**

Wait for the sync to go through and then browse your app service and verify that you can access it.

#### Deploy updates to the code

Update the file `routes/index.js` and change the title:

```javascript
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'AzureLab' });
});
```

Now commit the changes: (make sure you are in the root of the repository and that status shows `main.tf` and `index.js`)

```shell
git add .
git status
git commit -m "update terraform and title"
git push
```

Verify that in `Deployment Center` that tha change is picked up and when you browse the site you see `Welcome to AzureLab`. 

#### Cleaning up

Now use terraform to remove everything:

```terraform
cd terraform
terraform destroy
```

This should show an output like this:

```shell
azurerm_resource_group.this: Refreshing state... [id=/subscriptions/<subscription>/resourceGroups/rg-lab-we-webapp1]
azurerm_app_service_plan.this: Refreshing state... [id=/subscriptions/<subscription>/resourceGroups/rg-lab-we-webapp1/providers/Microsoft.Web/serverfarms/asp-lab-we-webapp1]
azurerm_app_service.this: Refreshing state... [id=/subscriptions/<subscription>/resourceGroups/rg-lab-we-webapp1/providers/Microsoft.Web/sites/wa-lab-we-webapp1]

An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  - destroy

Terraform will perform the following actions:

  # azurerm_app_service.this will be destroyed
  - resource "azurerm_app_service" "this" {
      - app_service_plan_id               = "/subscriptions/<subscription>/resourceGroups/rg-lab-we-webapp1/providers/Microsoft.Web/serverfarms/asp-lab-we-webapp1" -> null
      - app_settings                      = {} -> null
      - client_affinity_enabled           = false -> null
      - client_cert_enabled               = false -> null
      - custom_domain_verification_id     = "***" -> null
      - default_site_hostname             = "wa-lab-we-webapp1.azurewebsites.net" -> null
      - enabled                           = true -> null
      - https_only                        = false -> null
      - id                                = "/subscriptions/<subscription>/resourceGroups/rg-lab-we-webapp1/providers/Microsoft.Web/sites/wa-lab-we-webapp1" -> null
      - location                          = "westeurope" -> null
      - name                              = "wa-lab-we-webapp1" -> null
      - outbound_ip_address_list          = [
          - "[...]",
        ] -> null
      - outbound_ip_addresses             = "[...]" -> null
      - possible_outbound_ip_address_list = [
          - "[...]",
        ] -> null
      - possible_outbound_ip_addresses    = "[...]" -> null
      - resource_group_name               = "rg-lab-we-webapp1" -> null
      - site_credential                   = [
          - {
              - password = "***"
              - username = "$wa-lab-we-webapp1"
            },
        ] -> null
      - tags                              = {} -> null

      - auth_settings {
          - additional_login_params        = {} -> null
          - allowed_external_redirect_urls = [] -> null
          - enabled                        = false -> null
          - token_refresh_extension_hours  = 0 -> null
          - token_store_enabled            = false -> null
        }

      - logs {
          - detailed_error_messages_enabled = false -> null
          - failed_request_tracing_enabled  = false -> null

          - application_logs {
              - file_system_level = "Off" -> null
            }

          - http_logs {
            }
        }

      - site_config {
          - always_on                   = false -> null
          - default_documents           = [] -> null
          - dotnet_framework_version    = "v4.0" -> null
          - ftps_state                  = "AllAllowed" -> null
          - http2_enabled               = false -> null
          - ip_restriction              = [] -> null
          - linux_fx_version            = "NODE|14-lts" -> null
          - local_mysql_enabled         = false -> null
          - managed_pipeline_mode       = "Integrated" -> null
          - min_tls_version             = "1.2" -> null
          - number_of_workers           = 1 -> null
          - remote_debugging_enabled    = false -> null
          - remote_debugging_version    = "VS2019" -> null
          - scm_ip_restriction          = [] -> null
          - scm_type                    = "GitHub" -> null
          - scm_use_main_ip_restriction = false -> null
          - use_32_bit_worker_process   = false -> null
          - websockets_enabled          = false -> null

          - cors {
              - allowed_origins     = [] -> null
              - support_credentials = false -> null
            }
        }

      - source_control {
          - branch             = "main" -> null
          - manual_integration = false -> null
          - repo_url           = "https://github.com/<org / username>/<repo name>" -> null
          - rollback_enabled   = false -> null
          - use_mercurial      = false -> null
        }
    }

  # azurerm_app_service_plan.this will be destroyed
  - resource "azurerm_app_service_plan" "this" {
      - id                           = "/subscriptions/<subscription>/resourceGroups/rg-lab-we-webapp1/providers/Microsoft.Web/serverfarms/asp-lab-we-webapp1" -> null
      - is_xenon                     = false -> null
      - kind                         = "linux" -> null
      - location                     = "westeurope" -> null
      - maximum_elastic_worker_count = 1 -> null
      - maximum_number_of_workers    = 10 -> null
      - name                         = "asp-lab-we-webapp1" -> null
      - per_site_scaling             = false -> null
      - reserved                     = true -> null
      - resource_group_name          = "rg-lab-we-webapp1" -> null
      - tags                         = {} -> null

      - sku {
          - capacity = 1 -> null
          - size     = "B1" -> null
          - tier     = "Basic" -> null
        }
    }

  # azurerm_resource_group.this will be destroyed
  - resource "azurerm_resource_group" "this" {
      - id       = "/subscriptions/<subscription>/resourceGroups/rg-lab-we-webapp1" -> null
      - location = "westeurope" -> null
      - name     = "rg-lab-we-webapp1" -> null
      - tags     = {} -> null
    }

Plan: 0 to add, 0 to change, 3 to destroy.
```

Please, always check and double check the output before you write `yes`. It won't be the first time someone deletes too much using this command.

## LAB DONE!

Well done! :-)

# Next Lab

Click [here](03-container-deployment.md) to go to the next lab.

# Go back

Click [here](../README.md) to go back to lab overview.