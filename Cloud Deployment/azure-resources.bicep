@description('Location for all resources')
param location string = resourceGroup().location

@description('Base name for resources')
param baseName string

@description('MySQL admin username')
param dbAdmin string

@secure()
@description('MySQL admin password')
param dbPassword string

@description('App Service plan SKU')
param sku string = 'P1v3'

var appServicePlanName = '${baseName}-plan'
var apiAppName = '${baseName}-api'
var webAppName = '${baseName}-web'
var mysqlServerName = toLower('${baseName}mysql')
var mysqlDbName = 'finscope'

resource plan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: sku
    capacity: 1
  }
  kind: 'app'
}

resource apiApp 'Microsoft.Web/sites@2023-12-01' = {
  name: apiAppName
  location: location
  kind: 'app'
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
  }
}

resource webApp 'Microsoft.Web/sites@2023-12-01' = {
  name: webAppName
  location: location
  kind: 'app'
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
  }
}

resource mysql 'Microsoft.DBforMySQL/flexibleServers@2023-12-01' = {
  name: mysqlServerName
  location: location
  sku: {
    name: 'Standard_D2ds_v4'
    tier: 'GeneralPurpose'
    capacity: 2
  }
  properties: {
    administratorLogin: dbAdmin
    administratorLoginPassword: dbPassword
    version: '8.0.21'
    storage: {
      storageSizeGB: 32
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    network: {
      publicNetworkAccess: 'Enabled'
      delegatedSubnetResourceId: ''
    }
  }
}

resource mysqlDb 'Microsoft.DBforMySQL/flexibleServers/databases@2023-12-01' = {
  name: '${mysql.name}/${mysqlDbName}'
  properties: {}
}

resource apiSettings 'Microsoft.Web/sites/config@2023-12-01' = {
  name: '${apiApp.name}/appsettings'
  properties: {
    NODE_ENV: 'production'
    PORT: '3000'
    DB_HOST: mysql.properties.fullyQualifiedDomainName
    DB_USER: dbAdmin
    DB_PASSWORD: dbPassword
    DB_NAME: mysqlDbName
    JWT_SECRET: 'CHANGE_ME_IN_PORTAL'
  }
  dependsOn: [mysqlDb]
}

resource webSettings 'Microsoft.Web/sites/config@2023-12-01' = {
  name: '${webApp.name}/appsettings'
  properties: {
    REACT_APP_API_BASE_URL: 'https://${apiApp.name}.azurewebsites.net'
  }
}

output apiAppName string = apiApp.name
output webAppName string = webApp.name
output mysqlFqdn string = mysql.properties.fullyQualifiedDomainName
output mysqlDb string = mysqlDbName
