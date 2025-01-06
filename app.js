import dotenv from 'dotenv';
import app from './config/serverSetup.js';
import DBConnect from './config/DBConnect.js';

dotenv.config();

await DBConnect().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on ${process.env.PORT}`);
    })
}).catch(() => {
    console.log('Error starting server');
})