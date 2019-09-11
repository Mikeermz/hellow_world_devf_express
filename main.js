const colors = require('colors');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const dataset = require('./dataset');

const app = express();

// Configuracion para poder recibir el body 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Endpoint 
app.get('/', (req, response) => {
  const a = 23;
  const b = 22;
  const c = a + b
  response.send({message: `Hola, mi primer endpoint =,D y el total es ${c}` })
});

app.get('/home', (req, response) => {
  response.send({message: `mensaje desde el home ` })
});

// Params
// localhost:4000/usuarios/1/
app.get('/usuarios/:idUser', (req, response) => {
  const { idUser } = req.params;
  const empleadoDB = dataset.empleados.find((empleado) => empleado.id === Number(idUser) );

  if (empleadoDB){
    response.send({empleadoDB})
  } else {
    response.send({message: `no hay usuarios` })
  }
})

// localhost:4000/usuarios/mikee/
app.get('/usuarioPorNombre/:nombre', (req, response) => {
  const { nombre} = req.params;
  const empleadoDB = dataset.empleados.find((empleado) => empleado.name === nombre );

  if (empleadoDB){
    response.send({empleadoDB})
  } else {
    response.send({message: `no hay usuarios` })
  }
})

// Querys
//  ?nombre=<Nombre de la busqueda>
app.get('/busqueda', (req, response) => {
  const { nombre, ...jaja } = req.query;
  console.log(jaja);
  const empleadoDB = dataset.empleados.find((empleado) => empleado.name === nombre );

  if (empleadoDB){
    response.send({empleadoDB})
  } else {
    response.send({message: `no hay usuarios` })
  }
})

//http://localhost:4000/busqueda?nombre=Mikee&&edad=27&&color=rojo&&id=1

// Post parar crear un nuevo usuario
app.post('/usuario', (req, response) => {
  const nombre = req.body.nombre;
  const Edad = req.body.Edad;
  const id = dataset.empleados.length + 1;

  const data = {
    nombre, 
    Edad,
    id
  };

  dataset.empleados.push(data);

  response.send({empleados: dataset.empleados });
})

// Patch para editar un usuario existente
app.patch('/usuario/:id', (req, response) => {
  const { id } = req.params;
  const { nombre } = req.body;
  const empleadoDB = dataset.empleados.find((empleado) => empleado.id === Number(id) );

  if(!empleadoDB) return response.json('No hay usuarios')

  empleadoDB.name = nombre;

  response.send({empleado: empleadoDB });
})

// Endpoint para traerme todos los usuarios
app.get('/usuarios', (req, response) => {
  response.send({empleados: dataset.empleados });
})

app.delete('/usuario/:id', (req, response) => {
  const { id } = req.params;
  
  const empleadoDB = dataset.empleados.find((empleado) => empleado.id === Number(id) );
  console.log('empleado:' , empleadoDB)
  if(!empleadoDB) return response.json('No hay usuarios')
  
  const removeItem = dataset.empleados.indexOf(empleadoDB);
  console.log('item:', removeItem)

  dataset.empleados.splice(removeItem, 1)

  response.send({empleados: dataset.empleados });

})

// Escuchando y leyendo todo lo que pasa en el puerto.
app.listen(4000, () => {
  console.log('Server on port 4000'.cyan);
});
