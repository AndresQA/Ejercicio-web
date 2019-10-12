const express = require("express");
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("port", process.env.PORT || 3000);
app.use(express.json());

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
});



app.get('/api/productos', (request, response) => {
  response.send(productos);

});

var productos = []
var asignado = 0;

app.get("/api/getproductos", (request, response) => {
  response.send({
    productos:productos
  });
});

app.delete("/api/removeproductos", (request, response) => {
  let producto = request.body;
  let number = parseInt(producto.id);
  productos.forEach((p)=>{
    if(number == p.id){
      productos.splice(p, 1);
    }
  })
 
  response.send({
    mensaje:"Producto eliminado"
  });
});

app.post("/api/addproductos", (request, response) => {
  let producto = request.body;
  asignado++;
  producto.id = asignado;
  productos.push(producto);
  response.send({
    mensaje:"Recidbido",
    producto:producto
  });
});

app.put("/api/editarproductos", (request, response) => {
  let producto = JSON.parse(request.body.producto);
 
  
  productos.forEach((p)=>{
  
    if(producto.id == p.id){
      p.producto = request.body.producto;
    }
  });
 
  response.send({
    mensaje:"Producto cambiado"
  });
});

app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
