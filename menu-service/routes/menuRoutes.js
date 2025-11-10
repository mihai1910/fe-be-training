import express from 'express'
import { MenuItem } from './db/MenuItem.js'

const router = express.Router();

router.get('/', async (req, res, next) =>{
    try{
        const getItems = await MenuItem.find();
        res.status(200).json(getItems);
    } catch(err) {
        next(err);
    }
})

router.post('/', async (req, res, next) => {
    try{
        if(!req.body.name || !req.body.category || !req.body.price) 
            throw new Error('Please make sure to fill all required fields');

        const newItem = await MenuItem.create(req.body)
        res.status(201).json(newItem);
    } catch(err){
        next(err);
    }
})

router.put('/:id', async (req, res, next) => {
    try{
        const found = await MenuItem.findById(req.params.id);
        if(!found)
            throw new Error("404: Invalid ID")

        const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, 
            {
                name: req.body.name, 
                category: req.body.category, 
                price: req.body.price
            }, 
            {new: true}
        )
        res.status(202).json(updatedItem);        
    } catch(err) {
        next(err);
    }
})

router.delete('/:id', async (req, res, next) => {
    try{
        if(!MenuItem.findById(req.params.id))
            throw new Error("There's no item for specified ID");
        const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Item deleted successfully"});
    } catch(err){
        next(err);
    }
});

router.use((err, req, res, next) => {
    console.log(err.message)
    res.status(err.status || 500).json({message: err.message})
})