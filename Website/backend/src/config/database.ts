import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import User from "../models/User";
import Host from "../models/Host";
import Partner from "../models/Partner";
import Subscription from "../models/Subscription";
import Subscriptionplan from "../models/Subscriptionplan";
import Event from "../models/Event";
import BoothDetails from "../models/BoothDetails";
import Invitation from "../models/Invitation";
import PrivateEventCredential from "../models/PrivateEventCredential";
dotenv.config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST, 
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME, 
  models: [User, Host, Partner, Subscription, Subscriptionplan, Event, BoothDetails, Invitation,PrivateEventCredential],  // Register models here
  logging: false, // Set to true if you want to see SQL queries
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");
    // Define associations after initializing Sequelize
    User.hasOne(Partner, { foreignKey: 'userId' });
    Partner.belongsTo(User, { foreignKey: 'userId' });

    Host.hasMany(Subscription, { foreignKey: 'hostId' });
    Subscription.belongsTo(Host, { foreignKey: 'hostId' });

    Host.hasMany(Event, { foreignKey: 'hostId' });
    Event.belongsTo(Host, { foreignKey: 'hostId' });

    Subscription.hasOne(Event, { foreignKey: 'subscriptionId' });
    Event.belongsTo(Subscription, { foreignKey: 'subscriptionId' });

    Subscriptionplan.hasMany(Subscription, { foreignKey: 'planId' });
    Subscription.belongsTo(Subscriptionplan, { foreignKey: 'planId' });

    Event.hasMany(BoothDetails, { foreignKey: 'eventId' });
    BoothDetails.belongsTo(Event, { foreignKey: 'eventId' });

    Event.hasOne(PrivateEventCredential, { foreignKey: 'eventId' });
    PrivateEventCredential.belongsTo(Event, { foreignKey: 'eventId' });

    Partner.hasMany(BoothDetails, { foreignKey: 'partnerId' });
    BoothDetails.belongsTo(Partner, { foreignKey: 'partnerId' });

    BoothDetails.hasMany(Invitation, { foreignKey: 'boothDetailsId' });
    Invitation.belongsTo(BoothDetails, { foreignKey: 'boothDetailsId' });
    

    await sequelize.sync();
   await Subscriptionplan.sync({ alter: true });
    console.log("Database synchronized!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default sequelize;
