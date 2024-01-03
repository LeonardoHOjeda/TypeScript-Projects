# KIOSKO-APP (Node y TypeScript)

El proyecto KIOSKO-APP es un proyecto que se encarga de gestionar la información de los empleados que se encuentran en la base de datos de la empresa para que los mismos puedan acceder a la información de su nómina, préstamos, vacaciones, generar justificantes, etc.

# Instalación del proyecto

## Descargar Repositorio
### HTTPS
`git clone https://gitlab.gobdigital.com/nomina/s3-checadas-sync`

## Instalar dependencias de desarrollo

Una vez descargado el repositorio, ejecutar el siguiente comando
`npm install`

## Comando para correr el proyecto en **MODO DESARROLLO**

`npm run dev`

## ESLint usado

- [ts-standard](https://www.npmjs.com/package/ts-standard)

## ORM
- [typeorm](https://www.npmjs.com/package/typeorm)	

## Versiones de Node y NPM
- Node: 18.17.1
- NPM: 9.6.7


## Docker Build
Crear la imagen de docker
`docker build -t registry.gobdigital.com/nomina/kiosko_api_backend:VERSION_NAME .`

Subir la imagen de docker
`docker push registry.gobdigital.com/nomina/kiosko_api_backend:VERSION_NAME`