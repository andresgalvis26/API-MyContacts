# Comandos para usar el codigo NodeJS directamente en el App Service creado por Terraform

---

## Comando para empaquetar proyecto ZIP en Ubuntu excluyendo carpetas NO requeridas para cargar a Azure 

```
zip -r api-mycontacts.zip . \
  -x "node_modules/*" \
  -x "contacts-infra/*" \
  -x ".git/*" \
  -x "*.terraform/*" \
  -x "*.tfstate*" \
  -x "*.md"
``` 

---

## Comando para hacer deploy al App Service
```
az webapp deployment source config-zip \
  --resource-group <tu-rg> \
  --name <tu-app-service-name> \
  --src api-mycontacts.zip
``` 

---

## Comando a ejecutar en Windows para manejar automaticamente los cierres de linea (LR ubuntu o CRLF windows)
``` 
git config --global core.autocrlf true
``` 
