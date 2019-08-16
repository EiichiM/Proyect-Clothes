const mongoose = require('mongoose');
const URL = "mongodb+srv://EiichiMS:chorrillo@eiichim-ossme.mongodb.net/test?retryWrites=true&w=majority";
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 5000;
const { Clothes } = require("./models/store.js")
mongoose.connect(URL, () => { console.log("----- Base de Datos Conectada -----") });

const articuloSchema = mongoose.Schema({
    articulo: mongoose.Schema.ObjectId,
    nombre: mongoose.CSchema.map.name_product,
    precio: mongoose.CSchema.map.price,
    existencias: { type: Number, default: 10 }
});
const cartSchema = mongoose.Schema({
    cart : mongoose.Schema.ObjectId,
    subtotal: mongoose.CSchema.map.price,
    iva: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    articulos: [{ type: mongoose.Schema.ObjectId, ref: 'CShema', required: true }]
});
const Articulo = mongoose.model('Articulo', articuloSchema);
const Cart = mongoose.model('Cart', cartSchema);

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())


app.get('articulos/:id/', (req, res) => {
    const articuloId = req.params.id;
    Articulo.findById(articuloId).exec().then(articulo => res.status(200).send(articulo)).catch(error => res.status(404).send(error));
});


app.post('/cart/', (req, res) => {
    const jsonCliente = req.body
    const nuevoCarrrito = Cart(jsonCliente);
    nuevoCarrrito.save((error, carro) => {
        res.status(201).send(carro);
    });
});

app.get('/cart/', (req, res) => {
    Cart.find().populate('articulos').exec().then(listaCarts => res.status(200).send(listaCarts)).catch(error => res.status(400).send(error));
});

app.get('/cart/:id/', (req, res) => {
    const cartId = req.params.id;
    Cart.findById(cartId).populate('articulos').exec().then(cart => res.status(200).send(cart)).catch(error => res.status(404).send(error));
});

app.put('/cart/:id/', (req, res) => {
    const cartId = req.params.id;
    Cart.findByIdAndUpdate(cartId, { $set: req.body }, { new: true }).exec().then(cartActualizado => res.status(200).send(cartActualizado)).catch(error => res.status(400).send(error));
});

app.post('/cart/:id/agregar', async (req, res) => {
    const { CSchema } = req.body;
    const cart = await Cart.findById(req.params.id);
    if (!cart) throw new Error('Error al agregar items al carrito');
    cart.articulos.push(...CSchema);
    res.send( await cart.save());
});

app.delete('/delete/', (req, res) => {
    const cartId = req.params.id;
    Cart.findByIdAndDelete(cartId).exec().then(cart => res.status(204).send('Cart eliminado exitosamente.')).catch(error => res.status(404).send(error));
});

app.post("/clothing", (req, res) => {
    const { store_name, name_product, c_type, color, price, talla, url } = req.body
    const newClothes = Clothes({ store_name, name_product, c_type, color, price, talla, url })
    newClothes.save((err, Store) => {
        err
            ? res.status(409).send(err)
            : res.status(201).send(Store)
    })
});

app.get("/all/products", (req, res) => {
    Clothes.find().exec().then(products => res.send(products)).catch(err => res.status(409).send(err))
});

app.get("/", (req, res) => { res.status(200).send({ 'mensaje': 'Im in home' }) });

app.patch("/modificar", (req, res) => {
    console.log(req.body)
    const { store_name, name_product, c_type, color, price, talla, url } = req.body
    res.send({
        store_name,
        name_product,
        c_type,
        color,
        price,
        talla,
        url,
    })
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});