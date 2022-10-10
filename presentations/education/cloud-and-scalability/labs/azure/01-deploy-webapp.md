# LAB #01 - Deploying a webapp

## Pre-requisites

- [Internet](https://en.wikipedia.org/wiki/Internet)
- [Azure Subscription](https://azure.microsoft.com/en-us/free/)
- [Visual Studio Code](https://code.visualstudio.com/) _v1.71.2_
  - [Azure App Service for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) _v0.24.4_
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) _v2.40.0_
- [Node.js 16](https://nodejs.org/en/) _v16.17.1_
- [npm](https://www.npmjs.com/get-npm) _v8.19.2_

## Description

We will create a web app and deploy a small web application to it.

## Lab

### Login to Azure

**PORTAL**

Go to [portal.azure.com](https://portal.azure.com) and login using an account that has a subscription.

**CLI**

```shell
az login
az account list -o table
az account set --subscription "Visual Studio Enterprise" # Note that your subscription could have another name. You can use it's ID (UUID) instead as well.
```

When writing this, I am using azure-cli version `2.40.0`.

**NOTES**

- **PLEASE** verify that this is a lab subscription and you are allowed to create things in here. If you forget to remove it afterwards - it may cost you or your employer/client `$$$`.
- I will use a "common name" in this guide with the name `webapp1`. Since some resources, like App Services, needs to have globally unique names - you can't use it. When you see `webapp1` change it in all places to something like your initials + a number (example: `sg1990`). In a production enironment, it should is recommended to use something that refers to what is actually used. Remember that tags on resources also can describe information about it.
- I will use the subscription name `Visual Studio Enterprise` in most places - this may differ from your subscription name.
- You can change the language of the Azure Portal by clicking the `Portal Settings` (the gear) in the top right corner and then going to `Language & region`.
- Resource types you frequently use in the portal can be added to the left bar by opening it, going to `All services` and in there searching for the resource - then holding over the resource and pressing the star.

### Creating a resource group

**INFO**

A resource group is a container that holds related resources for an Azure solution. The resource group can include all the resources for the solution, or only those resources that you want to manage as a group.

More info: [Manage Azure Resource Manager resource groups by using the Azure portal](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal)

**PORTAL**

The first thing we need to do is create an `Azure Resource Group`. The easiest way to do it is to search for `Resource groups` in the search bar at the top of the page.

Press `+ Create` in the top left corner and then:

- Subscription: `Visual Studio Enterprise`
- Resource group: `rg-lab-we-webapp1`
- Region: `(Europe) West Europe`

Press `Review + create` and then `Create` at the bottom left corner.

**CLI**

```shell
az group create --location westeurope --name rg-lab-we-webapp1
```

**NOTES**

- Using naming conventions in Azure is recommended. Read [Develop your naming and tagging strategy for Azure resources](https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging) for more information.
- The abbreviations in `rg-lab-we-webapp1`stands for:

| Short name | Description                                          |
| ---------- | ---------------------------------------------------- |
| rg         | The resource type (Resource Group)                   |
| lab        | The environments used (examples: lab, dev, qa, prod) |
| we         | The location (West Europe)                           |
| webapp1    | A description of the purpose of the application.     |

### Creating app service plan

**INFO**

In App Service (Web Apps, API Apps, or Mobile Apps), an app always runs in an App Service plan. In addition, Azure Functions also has the option of running in an App Service plan. An App Service plan defines a set of compute resources for a web app to run. These compute resources are analogous to the server farm in conventional web hosting. One or more apps can be configured to run on the same computing resources (or in the same App Service plan).

More info: [Azure App Service plan overview](https://docs.microsoft.com/en-us/azure/app-service/overview-hosting-plans)

**PORTAL**

Search for `App Service plan` in the top search bar.

Press `+ Create` in the left corner and then:

- Project Details > Subscription: `Visual Studio Enterprise`
- Project Details > Resource group: `rg-lab-we-webapp1`
- App Service Plan details > Name: `asp-lab-we-webapp1`
- App Service Plan details > Operating System: \[v\] `Linux`
- App Service Plan details > Region: `West Europe`
- Pricing Tier > Sku and size: `Dev / Test` > `B1`

Press `Review + create` and then `Create`.

**CLI**

```shell
az appservice plan create --is-linux --location westeurope --sku B1 --resource-group rg-lab-we-webapp1 --name asp-lab-we-webapp1
```

**NOTES**

- Abbreviations:

| Short name | Description                          |
| ---------- | ------------------------------------ |
| asp        | The resource type (App Service Plan) |

### Creating the web app

**INFO**

Azure App Service is an HTTP-based service for hosting web applications, REST APIs, and mobile back ends. You can develop in your favorite language, be it .NET, .NET Core, Java, Ruby, Node.js, PHP, or Python. Applications run and scale with ease on both Windows and Linux-based environments.

More info: [App Service overview](https://docs.microsoft.com/en-us/azure/app-service/overview)

**PORTAL**

Search for `App Services` in the top search bar.

Press `+ Create` in the left corner and then:

- Project Details > Subscription: `Visual Studio Enterprise`
- Project Details > Resource group: `rg-lab-we-webapp1`
- Instance Details > Name: `wa-lab-we-webapp1`
- Instance Details > Publish: \[v\] `Code`
- Instance Details > Runtime stack: `Node 16 LTS`
- Instance Details > Operating System: \[v\] `Linux`
- Instance Details > Region: `West Europe`
- App Service Plan > Linux Plan (West Europe): `asp-lab-we-webapp1`
- App Service Plan > Sku and size: `Basic B1`

Press `Review + create` and then `Create`.

**CLI**

```shell
az webapp create --plan asp-lab-we-webapp1 --resource-group rg-lab-we-webapp1 --runtime "NODE|16-lts" --name wa-lab-we-webapp1
```

**NOTES**

- The name `wa-lab-we-webapp1` is required to be globally unique. Change `webapp1` to something else.
- When the App Service is created, you should be able to browse to it: `https://wa-lab-we-webapp1.azurewebsites.net/`. You can find the name by opening the App Service and looking at URL in the Overview page.
- If you want to find the URL using the CLI, you can run:
  - Raw JSON: `az webapp show --resource-group rg-lab-we-webapp1 --name wa-lab-we-webapp1` (look for `defaultHostName`)
  - Only hostname: `az webapp show --resource-group rg-lab-we-webapp1 --name wa-lab-we-webapp1 --query defaultHostName --output tsv`
  - Launch web browser from CLI: `az webapp browse --resource-group rg-lab-we-webapp1 --name wa-lab-we-webapp1`
- Abbreviations:

| Short name | Description                 |
| ---------- | --------------------------- |
| wa         | The resource type (Web App) |

### Deploying code

**INFO**

There are lots of way to deploy code to an App Service. We'll use a development friendly way, but should most likely not be used in production.

More info: [Create a Node.js web app in Azure](https://docs.microsoft.com/en-us/azure/app-service/quickstart-nodejs?pivots=platform-linux)

**PRE-REQUISITES**

Make sure you have the following installed:

- [Visual Studio Code](https://code.visualstudio.com/) _v1.71.2_
  - [Azure App Service for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) _v0.24.4_
- [Node.js 16](https://nodejs.org/en/) _v16.17.1_
- [npm](https://www.npmjs.com/get-npm) _v8.19.2_

As of writing this, I am using Node.js version `v16.17.1` and npm version `8.19.2`.

In VS Code, go to the `Azure App Services` extension and login to your Azure Subscription. Make sure you see your App Service in the extension.

**SCAFFOLDING**

Go to a suitable directory on your computer and create your Node.js application:

```shell
npx express-generator webapp-lab --view pug --git
cd webapp-lab
npm install
npm start
```

You should now be able to browse the application locally: [`localhost:3000`](http://localhost:3000)

When you have verified that you can browse it locally, press `CTRL+C` to stop the local application.

**VS CODE**

From the directory your application is located, start VS Code: `code .` (if this doesn't work, open it using the VS Code menus)

Go to the `Azure App Services` extension and right click your App Service and choose `Deploy to Web App...` and choose your directory.

If you get a question like "Would you like to update your workspace configuration to run build commands on the target server? This should improve deployment performance.", press `Yes`.

When you are asked "Are you sure you want to deploy ...", verify the name of the web app that it's the one you created and then press `Deploy`. You can no check the output window and see the progress.

Wait until it says Deployment successful and then click `Browse Website`.

You can click on the `output window` in the pop-up in the bottom right corner to see exactly what is happening.

**NOTES**

- This guide is written from a Mac, which means there may be differences if you are using Linux or Windows - but hopefully most things will work in the same way.

### Cleaning up resource

Deleting the resource group will also delete all resources inside it.

If you want protection from deleting someting by accident, you can use something called a Lock: [Lock resources to prevent unexpected changes](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/lock-resources)

**PORTAL**

Go to the resource group you created and then `Delete resource group`. Be **REALLY** careful here and double and tripple check that it's the correct one you are deleting. You have been warned!

Write the resource group name and press `Delete`.

**CLI**

Running the following command it will ask you if you are sure and you will have to write `y` to continue.

```shell
az group delete --name rg-lab-we-webapp1
```

# Next Lab

Click [here](02-deployment-iac.md) to go to the next lab.

# Go back

Click [here](../README.md) to go back to lab overview.
