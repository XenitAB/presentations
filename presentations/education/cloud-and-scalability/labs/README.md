# Lab overview

This directory contains a few labs that can be done in combination with the presentation.

## Background

To be able to deploy code you are developing, you need somewhere to run it. These labs introduce you to how you deploy infrastructure (or SaaS / PaaS services) that can make your code available to others.

To make sure you are comfortable with the different concepts, we try to introduce you to the deployment using both the Azure Portal and the Azure CLI.

When you are done with these labs, you will have deployed a Node.js application to Azure using a few different concepts:

  - Using the Azure Portal (and/or CLI) to setup infrastructure and VS Code to deploy the application
  - Using terraform to setup the infrastructure and git integration in Azure Web App to deploy the application
  - Using terraform to setup the infrastructure and Azure Container Registry and a container to deploy the application

When you are done with the labs, you should have a basic understanding of how to setup a Web App in Azure using the Azure Portal, the Azure CLI and terraform. You should also have an understanding of different ways to deploy an application to a Web App, using VS Code, git and container.

Good luck and have fun!
  
## Containers

| Lab # | Description                                            |
| ----- | ------------------------------------------------------ |
| #01   | [Deploying a webapp](azure/01-deploy-webapp.md)        |
| #02   | [Deployment using IaC](azure/02-deployment-iac.md)     |
| #03   | [Deploy a container](azure/03-container-deployment.md) |