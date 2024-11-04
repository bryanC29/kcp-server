import express, { urlencoded } from 'express';
import cors from 'cors';

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

app.get('/', (req, res) => {
    res.status(200).json({'message': 'Working Backend'});
})

app.post('/', (req, res) => {
    res.status(200).json({'message': 'Post request received'});
})

import CertificateRoute from './routes/certificate.js';
import NotificationRoute from './routes/notification.js';
import NoticeRoute from './routes/notice.js';

app.use('/certificate', CertificateRoute);
app.use('/notification', NotificationRoute);
app.use('/notice', NoticeRoute);

export default app;