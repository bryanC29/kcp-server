import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    'origin': '*',
    'methods': 'GET,POST,',
}))

app.use(express.json({
    limit: '5mb',
}))

app.use(urlencoded({
    extended: true,
}))

app.use(cookieParser());

app.get('/', (req, res) => {
    res.status(200).json({'message': 'Working Backend'});
})

app.post('/', (req, res) => {
    res.status(200).json({'message': 'Post request received'});
})

import CertificateRoute from '../routes/certificate.js';
import UserRoute from '../routes/user.js';

app.use('/certificate', CertificateRoute);
app.use('/user', UserRoute);

export default app;