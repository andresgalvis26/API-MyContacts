terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# 1. Resource Group
resource "azurerm_resource_group" "rg" {
  name     = "rg-mycontacts-api"
  location = "East US"
}

# 2. App Service Plan
resource "azurerm_service_plan" "app_plan" {
  name                = "plan-mycontacts-api"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "B1"
}

# 3. Web App
resource "azurerm_linux_web_app" "webapp" {
  name                = "mycontacts-api-app"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.app_plan.id
  
  site_config {
    container_registry_use_managed_identity = false

    application_stack {
        docker_image     = "anfelipegalvis/api-mycontacts"
        docker_image_tag = "latest"
        }
  }

  app_settings = {
    "WEBSITES_PORT" = "3000"
  }
}