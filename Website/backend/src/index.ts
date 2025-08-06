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
import partnerRoute from './routes/partner.route';
import hostRoute from './routes/host.route';
import credentialRoute from './routes/credential.route'
import {authenticateUser} from './middleware/authentication'; // Import the authentication middleware
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

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
app.use(
  cors({
    origin: ["http://website-backend:5000", "http://localhost:5173", "http://localhost:3004"],
    credentials: true, 
  })
);

// login
app.use('/api/auth/user/', authuserRoute);
app.use('/api/users', userRoute);
app.use('/api/subscriptionplan/', subscriptionplanRoute);
app.use('/api/subscriptions/', subscriptionRoute);
app.use('/api/events', eventRoute);
app.use('/api/auth/host/', authhostRoute);
app.use('/api/invitations', invitationRoute);
app.use('/api/boothDetails', boothDetailsRoute);
app.use('/api/partner', partnerRoute);
app.use('/api/host', hostRoute);
app.use('/api/event/private/credentials', credentialRoute);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on http://website-backend:${PORT}`));
app.use("/", async(req:Request, res: Response) => {
  res.send("Welcome to the API");
});

export default app;