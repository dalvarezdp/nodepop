# Documentación API Nodepop

Nodepop es un servicio API para comprar y vender productos.

## Requisitos

* MongoDB 3.4.2 ejecutándose
* Node 6.10.1 LTS

## Como iniciarlo

* Clonar este repositorio y situarse en la raiz del proyecto.
* Ejecutar `npm install` para instalar las dependencias.
* Situarse en `/mongodb` y ejecutar `./startMongo.sh` para iniciar la base de datos.
* Ejecutar `npm run install_db` para cargar unos datos de ejemplo en MongoDB.
* Situarse en `/nodepop` y ejecutar `nodemon`.
* La dirección sería `http://localhost:3000`.

## API de usuarios

Para el uso del API, hay que estar autenticado por JSON Web Token por lo que lo primero que tenemos que hacer es obtener un Token.

### Autenticar usuarios de la BBDD

Petición POST:

Enviamos *email* y *clave* como parámetro en formato *x-www-form-urlencoded*

`http://127.0.0.1:3000/apiv1/usuarios/authenticate`

Nos devuelve un token el cual usaremos para las peticiones que realicemos al API.

```JSON
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNThlOTA3NzJkNzY1NDc1MjViYTE4NTFhIiwiaWF0IjoxNDkxNzM1ODIzLCJleHAiOjE0OTE5MDg2MjN9.6glRrmBrZKFmpSu7S53bGuuvZeK_xZ_Q0qfnSOZj9A4"
}
```

### Listar usuarios de la BBDD

Petición GET:

`http://localhost:3000/apiv1/usuarios?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNThlOTA3NzJkNzY1NDc1MjViYTE4NTFhIiwiaWF0IjoxNDkxNzM1ODIzLCJleHAiOjE0OTE5MDg2MjN9.6glRrmBrZKFmpSu7S53bGuuvZeK_xZ_Q0qfnSOZj9A4`

Nos devuelve respuesta en JSON.

```JSON
{
  "success": true,
  "result": [
    {
      "_id": "58e90772d76547525ba1851a",
      "nombre": "david",
      "email": "david@gmail.com",
      "clave": "A6xnQhbz4Vx2HuGl4lXwZ5U2I8iziLRFnhP5eNfIRvQ=",
      "__v": 0
    },
    {
      "_id": "58e90772d76547525ba1851b",
      "nombre": "pedro",
      "email": "pedro@gmail.com",
      "clave": "A6xnQhbz4Vx2HuGl4lXwZ5U2I8iziLRFnhP5eNfIRvQ=",
      "__v": 0
    }
  ]
}
```

### Registrar usuarios en la BBDD

Petición POST:

Se puede registrar tanto por una petición JSON como por parámetros en formato *x-www-form-urlencoded*

`http://localhost:3000/apiv1/usuarios/registro?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNThlOTA3NzJkNzY1NDc1MjViYTE4NTFhIiwiaWF0IjoxNDkxNzM1ODIzLCJleHAiOjE0OTE5MDg2MjN9.6glRrmBrZKFmpSu7S53bGuuvZeK_xZ_Q0qfnSOZj9A4`


```JSON
{
      "nombre": "carlos",
      "email": "carlos@gmail.com",
      "clave": "1234"
}
```

## API de anuncios

Para el uso del API, hay que estar autenticado por JSON Web Token por lo que lo primero que tenemos que hacer es obtener un Token.

### Lista de anuncios de la BBDD

Petición GET:

`http://localhost:3000/apiv1/anuncios?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNThlOTA3NzJkNzY1NDc1MjViYTE4NTFhIiwiaWF0IjoxNDkxNzM1ODIzLCJleHAiOjE0OTE5MDg2MjN9.6glRrmBrZKFmpSu7S53bGuuvZeK_xZ_Q0qfnSOZj9A4`

Nos devuelve la respuesta en JSON.

```JSON
{
  "success": true,
  "result": [
    {
      "_id": "58e90772d76547525ba18518",
      "nombre": "Bicicleta",
      "venta": true,
      "precio": 230.15,
      "foto": "http://localhost:3000/images/anuncios/bici.jpg",
      "__v": 0,
      "tags": [
        "lifestyle",
        "motor"
      ]
    },
    {
      "_id": "58e90772d76547525ba18519",
      "nombre": "iPhone 3GS",
      "venta": false,
      "precio": 50,
      "foto": "http://localhost:3000/images/anuncios/iphone.png",
      "__v": 0,
      "tags": [
        "lifestyle",
        "mobile"
      ]
    }
  ]
}
```

Soporta varios filtros:

`http://localhost:3000/apiv1/anuncios?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNThlN2RhMzg3NGVkZDY0Mjg5OTNhNThlIiwiaWF0IjoxNDkxNTk2NDU1LCJleHAiOjE0OTE3NjkyNTV9.gh1Se4twj2dr-EW4a7LA3_svKeNCCLz3rSkr08D5D2E&tag=mobile&precio=50-&start=0&limit=2&sort=precio&venta=false`

* Buscar por tags:  `tag=mobile` o `tag=mobile&tag=motor`.
* Por precio: Rango de precio (precio min. y precio max.) `precio=50-100`, `precio=50-`, `precio=-100`.
* Por venta: Si es para vender o no `venta=true` o `venta=false`.
* Por donde queremos empezar a mostrar datos: `start=0`.
* Cuantos datos queremos mostrar: `limit=2`.
* Ordenación: `sort=precio`.


### Lista el anuncio indicando su ID

Petición GET:

`http://localhost:3000/apiv1/anuncios/58e90772d76547525ba18518?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNThlN2RhMzg3NGVkZDY0Mjg5OTNhNThlIiwiaWF0IjoxNDkxNTk2NDU1LCJleHAiOjE0OTE3NjkyNTV9.gh1Se4twj2dr-EW4a7LA3_svKeNCCLz3rSkr08D5D2E`

Nos devuelve la respuesta en JSON.

```JSON
{
  "success": true,
  "result": {
    "_id": "58e90772d76547525ba18518",
    "nombre": "Bicicleta",
    "venta": true,
    "precio": 230.15,
    "foto": "http://localhost:3000/images/anuncios/bici.jpg",
    "__v": 0,
    "tags": [
      "lifestyle",
      "motor"
    ]
  }
}
```

### Registrar anuncio en la BBDD

Petición POST:

`http://localhost:3000/apiv1/anuncios?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNThlOTA3NzJkNzY1NDc1MjViYTE4NTFhIiwiaWF0IjoxNDkxNzM1ODIzLCJleHAiOjE0OTE5MDg2MjN9.6glRrmBrZKFmpSu7S53bGuuvZeK_xZ_Q0qfnSOZj9A4`

Nos devuelve la respuesta en JSON con el objeto creado o mensaje de error.

```JSON
{
  "nombre": "Router",
  "venta": true,
  "precio": 30.15,
  "foto": "casa.jpg",
  "tags": [
    "hogar",
    "internet"
  ]
}
```


### Actualizar anuncio indicando su ID

Petición PUT:

`http://localhost:3000/apiv1/anuncios/58e90772d76547525ba18518?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNThlN2RhMzg3NGVkZDY0Mjg5OTNhNThlIiwiaWF0IjoxNDkxNTk2NDU1LCJleHAiOjE0OTE3NjkyNTV9.gh1Se4twj2dr-EW4a7LA3_svKeNCCLz3rSkr08D5D2E`

Nos devuelve la respuesta en JSON con el objeto creado o mensaje de error.

```JSON
{
  "success": true,
  "result": {
    "_id": "58e90772d76547525ba18518",
    "nombre": "Bicicleta nueva",
    "venta": true,
    "precio": 280.15,
    "foto": "http://localhost:3000/images/anuncios/bici.jpg",
    "__v": 0,
    "tags": [
      "lifestyle",
      "motor"
    ]
  }
}
```

### Eliminar anuncio indicando su ID

Petición DELETE:

`http://localhost:3000/apiv1/anuncios/58e90772d76547525ba18518?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNThlN2RhMzg3NGVkZDY0Mjg5OTNhNThlIiwiaWF0IjoxNDkxNTk2NDU1LCJleHAiOjE0OTE3NjkyNTV9.gh1Se4twj2dr-EW4a7LA3_svKeNCCLz3rSkr08D5D2E`


### Listado de tags de la BBDD

Petición GET:

`http://localhost:3000/apiv1/anuncios/tags?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNThlN2RhMzg3NGVkZDY0Mjg5OTNhNThlIiwiaWF0IjoxNDkxNTk2NDU1LCJleHAiOjE0OTE3NjkyNTV9.gh1Se4twj2dr-EW4a7LA3_svKeNCCLz3rSkr08D5D2E`

Nos devuelve la respuesta en JSON.

```JSON
{
  "success": true,
  "result": [
    "lifestyle",
    "motor",
    "mobile"
  ]
}
```

## Manejador de errores en dos idiomas

Para poder recibir, en caso de error, el mensaje en el idioma deseado, podemos indicarlo en la cabecera de la petición mediante `lang=es` o `lang=en`.
