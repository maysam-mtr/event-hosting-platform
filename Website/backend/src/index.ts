import express, { Express,Request, Response } from 'express';

import sequelize from './config/database';
import {connectDB} from './config/database';
import authuserRoute from './routes/userAuth.route'; // Import the auth route
import userRoute from './routes/user.route'; // Import the user route
import authhostRoute from './routes/hostAuth.route';
import eventRoute from './routes/event.route';
import subscriptionRoute from './routes/subscription.route';
import subscriptionplanRoute from './routes/subscriptionplan.route';
import invitationRoute from './routes/invitation.route';
import boothDetailsRoute from './routes/boothDetails.route';
import {authenticateUser} from './middleware/authentication'; // Import the authentication middleware
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { sendInvitationEmail } from './services/invitation.service';

const connect =async ()=>{
  try{ await connectDB()
  }catch(err){
    console.log("err")
  }
}
connect();
dotenv.config();

const app: Express= express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true // Allow credentials (cookies) to be sent
}));

// login
app.use('/api/auth/user/', authuserRoute);
app.use('/api/users/', userRoute);
app.use('/api/subscriptionplan/', subscriptionplanRoute);
app.use('/api/subscriptions/', subscriptionRoute);
app.use('/api/events', eventRoute);
app.use('/api/auth/host/', authhostRoute);
app.use('/api/invitations', invitationRoute);
app.use('/api/boothDetails', boothDetailsRoute);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
app.use("/", async(req:Request, res: Response) => {
  res.send("Welcome to the API");
});

export default app;