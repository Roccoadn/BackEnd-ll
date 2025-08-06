import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongoConnection = async () => {
    try{
        await mongoose.connect(process.env.MONGO_KEY, { dbName: 'MercaditoDB' });
        console.log('Conexion exitosa a la base de datos');
    }
    catch{
        console.log('Error al conectar a la base de datos');
    }
    console.log("Mongo URI en producción:", process.env.MONGO_KEY);
}

export default mongoConnection;

