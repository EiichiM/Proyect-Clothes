const mongoose = require('mongoose');
const URL = "mongodb+srv://EiichiMS:chorrillo@eiichim-ossme.mongodb.net/test?retryWrites=true&w=majority";
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 5000;
const {Clothes} = require ("./models/store.js")
mongoose.connect(URL, () => { console.log("----- Base de Datos Conectada -----") });
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

app.post("/clothing", (req, res) => {
    const { store_name, name_product, c_type, color, price, talla, url } = req.body
    const newClothes = Clothes({ store_name, name_product, c_type, color, price, talla, url  })
    newClothes.save((err, Store) => {
        err
            ? res.status(409).send(err)
            : res.status(201).send(Store)
    })
});

app.get("/all/products",(req,res)=>{
    Clothes.find().exec().then(products=>res.send(products)).catch(err=>res.status(409).send(err))
});

app.get("/home", (req, res) => { res.status(200).send({ 'mensaje': 'Im in home' }) });



app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});