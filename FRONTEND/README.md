# KIOSKO-APP-FRONT

## Instalacion
### Descargar este repositorio
```git clone git@gitlab.gobdigital.com:lhernandez/kiosko-app-front.git```

### Instalar dependencias de desarrollo
```yarn```

```yarn install```

### Comando para correr el proyecto
```yarn dev```

## Tecnologias y Librerias
* React
* Vite
* Tailwind
  * PostCss
* Material UI
* TypeScript
* Axios
* FontAwesome
* date-fns
* @mui/x-date-pickers
* daysjs

## Docker Build

Crear la imagen de docker
`docker build -t registry.gobdigital.com/nomina/kiosko_front_react:VERSION_NAME .`

Subir la imagen de docker
`docker push registry.gobdigital.com/nomina/kiosko_front_react:VERSION_NAME`