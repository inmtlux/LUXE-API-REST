const { response} = require('express');
const { findById } = require('../models/container');
const {Container, User} = require('../models');

const getContainers = async(req,res) => {
    
    const query = { state: true }; 

    try {
        const [containers, total] = await Promise.all([
            Container.find(query),
            Container.countDocuments(query)
        ])
        res.status(200).json({ total, containers })
        
    } catch (error) {
        console.log(error);
        res.json(error);
    }

}
const getContainer = async(req,res= response) => {
    
    const {id} = req.params;

    try {
        const container = await Container.findById(id) // se podria validar por el state y demas
                                .populate('user','name');
        res.json(container);
        
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}
const createContainer = async(req,res= response) => {
    
    const name= req.body.name.toUpperCase();
    const type_container = req.body.type_container.toUpperCase();


    const containerDB = await Container.findOne({name,type_container});

    if (containerDB) {
        return res.status(400).json({
            msg: `El container ${containerDB.name}, ya existe`
        })
    }

    const data ={
        name,
        type_container,
        user: req.user._id,
    }

    const container = new Container(data);

    await container.save();

    res.status(201).json(container);
}
const updateContainer = async(req,res) => {
    const {id} = req.params;
    const {user, ...data} = req.body;

    const container = await Container.findByIdAndUpdate(id, data, {new:true});

    res.json(container);
}
const deleteContainer = async(req,res) => {
    
    const {id} = req.params;

    const container = await Container.findByIdAndUpdate(id,{state:false},{new:true});
    

    res.json(container)
}

const assignUser = async (req, res) => {
    
    const {id} = req.params;

    const {assign_user} = req.body;

    const user = await User.findById(assign_user);

    if(!user){
        return res.status(404).json({
            msg: `No existe usuario con el id ${assign_user}`
        })
    }

    const container = await Container.findByIdAndUpdate(id,{assign_user});

    res.status(200).json({
        msg: `El usuario a sido asignado al contenedor ${container.name}`,
    })
    

}

module.exports = {
    getContainer,
    getContainers,
    createContainer,
    updateContainer,
    deleteContainer,
    assignUser
}