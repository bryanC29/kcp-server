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

import CertificateRoute from './routes/certificate.js';
import NotificationRoute from './routes/notification.js';
import NoticeRoute from './routes/notice.js';
import LeaveRoute from './routes/leave.js';
import APIRoute from './routes/api.js';
import VerificationRoute from './routes/verification.js';
import UserRoute from './routes/user.js';

app.use('/certificate', CertificateRoute);
app.use('/notification', NotificationRoute);
app.use('/notice', NoticeRoute);
app.use('/leave', LeaveRoute);
app.use('/api', APIRoute);
app.use('/verify', VerificationRoute);
app.use('/user', UserRoute);

export default app;