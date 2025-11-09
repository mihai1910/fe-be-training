import mongoose from 'mongoose';

const menuItemsSchema = new mongoose.Schema({
    name: {type: String, required: true},
    category: {type: String, required: true},
    price: {type: String, required: true},
})

export const MenuItem = mongoose.model("MenuItem", menuItemsSchema);