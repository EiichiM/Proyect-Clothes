const mongoose = require("mongoose");
const url_mongo = "mongodb+srv://EiichiMS:chorrillo@eiichim-ossme.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(url_mongo, { useNewUrlParser: true }, (err) => {
    !err
        ? console.log("Succesfully connected to MongoDB")
        : console.log("Shit")
});

const Schema = mongoose.Schema;
const CShema = new Schema({
    store_name: String,
    name_product: String,
    c_type: String,
    color: String,
    price: Number,
    talla: String,
    gender: String,
    estilo: String,
    url: String,
},{ timestamps:true})

const Clothes=mongoose.model("clothingModel",CShema)
module.exports={Clothes}
