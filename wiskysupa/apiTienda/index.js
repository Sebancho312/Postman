import  express from "express"
import cors from "cors"


const productos = [
    {id:1, nombre: "Lechugas", precio: 1.5},
    {id:2, nombre: "Leche", precio: 2.5},
    {id:3, nombre: "Arroz", precio: 10.5},
    {id:4, nombre: "Azucar", precio: 11.5},
];
const siguiente = 5;

const app = express();
app.use(cors());
app.use(express.json());

//app.get("/", (req,res)=>{
//    res.send("Bienvenido a mi API Pucesi");
//});

app.get("/productos", (req,res)=>{
   res.json(productos);
});

//app.get("/productos/:id",(req,res)=>{
  //  const id = parseInt(req.params.id);
    //const producto = productos.find((p)=>p.id===id);

  //  if(!producto){
   //     return res.status(404).json({mensaje: "Producto no existe"});
    //}
    //else{
     //   res.json(producto);
   // }

//});

app.get("/productos/:nombre",(req,res)=>{
    const nombre = req.params.nombre;
    const producto = productos.find((p)=>p.nombre===nombre);

    if(!producto){
        return res.status(404).json({mensaje: "Producto no existe"});
    }
    else{
        res.json(producto);
    }

});

app.post("/agregarProducto", (req,res)=>{
    const {nombre, precio} = req.body;

    const nuevo = {id: siguiente, nombre,precio};
    productos.push(nuevo);
    siguiente++;
    res.status(201).json(nuevo);
});

app.listen(3000, () =>{
    console.log("Servidor activo en local http://localhost:3000")
}); 