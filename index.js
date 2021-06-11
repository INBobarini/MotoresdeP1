const express = require ('express');
const Producto = require('./ClassProducto')
const handlebars = require('express-handlebars')

const app = express();
var router = express.Router()

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use('/api', router)

app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
    })
);
app.set("view engine", "hbs");
app.set("views", "./views");

var sesion = new Producto;

app.get("/productos/vista", (req, res) => {
    let productos = sesion.listar(0)
    res.render("datos", {lista:productos, hayLista:sesion.listar(0).length})
});

app.post('/index.html', (req, res) => {
    res.json(sesion.guardar(...Object.values(req.body)))
    //res.redirect(301,'/index.html')
})

router.get('/productos', (req, res) => {
    res.json(sesion.listar(0||req.query.id))
    console.log(`get con id: ${req.query.id}`)
})
router.get('/productos/:id', (req, res) => {
    res.json(sesion.listar(req.params.id))
    console.log(`get con id: ${req.params.id}`)
})
router.post('/productos', (req, res) => { //tiene que recibir JSON
    res.json(sesion.guardar(...Object.values(req.body)))
    console.log(req.body)
})
router.put('/productos/:id', (req, res) => {
    let id = req.params.id
    res.json(sesion.actualizar(id,...Object.values(req.body)))
    console.log(`Actualizado con id: ${id}`)
})
router.delete('/productos/:id', (req, res) => {
    res.json(sesion.borrar(req.params.id||req.query.id))
    console.log(`borrado con id: ${req.params.id}`)
})

const puerto = 8080;
const server = app.listen(puerto, () => { 
   console.log(`Servidor inicializado en ${server.address().port}`) 
})
server.on("error", error => console.log(`Error en servidor: ${error}`))