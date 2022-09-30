const {model, Schema} = require('mongoose');

const ContainerSchema = new Schema({
    name:{
        type: String,
        required: [true,'Name is required'],
        unique: true
    },
    nro_items:{
        type:Number,
        default:0

    },
    maximum_space:{
        type:Number,
        default:0
    },
    type_container:{
        type: String,
        required: [true,'Type container is required']
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    estado:{
        type: Boolean,
        default: true,
        required:true
    },
});

ContainerSchema.methods.toJSON = function(){
    const { __v,estado, ...data } = this.toObject();//quitar __v del paginado | data muestra

    return data;
}

module.exports= model('Container',ContainerSchema,'container')