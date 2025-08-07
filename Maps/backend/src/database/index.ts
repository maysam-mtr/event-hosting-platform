import { Dialect, Sequelize } from 'sequelize'
import mapModel from './models/map.model'
import latestMapModel from './models/latest-map.model'
import {
    DB_DIALECT,
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USERNAME,
} from '@/config'

const sequelize = new Sequelize(
    DB_NAME as string,
    DB_USERNAME as string,
    DB_PASSWORD,
    {
        dialect: (DB_DIALECT as Dialect),
        host: DB_HOST,
        port: parseInt(DB_PORT as string, 10),
        timezone: '+09:00',
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            underscored: true,
            freezeTableName: true,
        },
        pool: {
            min: 0,
            max: 5,
        },
        benchmark: true,
    },
)

export const DB = {
    Maps: mapModel(sequelize),
    LatestMaps: latestMapModel(sequelize),
    sequelize, // connection instance (RAW queries)
    Sequelize, // library
}


export async function initializeDatabase(): Promise<void> {
    try {
        await sequelize.authenticate()
        console.log(`Connection to ${DB_NAME} has been established successfully.`)
        // await sequelize.sync({ alter: true }) // Sync models with the database
        console.log('Database synchronized successfully.')
    } catch (err: any) {
        throw err
    }
}