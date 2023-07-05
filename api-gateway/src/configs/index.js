require('dotenv').config()


const config = {
    env: {
        isProduction: process.env.ENV.toString().toLowerCase() === 'production',
        ENV: process.env.ENV || undefined,
        SERVER_PORT: Number(process.env.SERVER_PORT) || undefined,
        FRONTEND_URL: process.env.FRONTEND_URL || undefined,
        PUBLIC_URL: process.env.PUBLIC_URL || undefined,
        SESSION_SECRET: process.env.SESSION_SECRET || undefined,
        JWT_SECRET: process.env.JWT_SECRET || undefined,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || undefined,
        YEARS_HISTORICAL_DATA: process.env.YEARS_HISTORICAL_DATA || undefined,

        DB_HOST: process.env.DB_HOST || "localhost",
        DB_PORT: process.env.DB_PORT || 5432,
        DB_USER: process.env.DB_USER || "postgres",
        DB_PASS: process.env.DB_PASS || "",
        DB_NAME: process.env.DB_NAME || "db_ituy",
    }
};


(() => {
    let statusLoadENV = true
    for (let [key, value] of Object.entries(config.env)) 
        if (value === undefined) {
            statusLoadENV = false
            console.log(` > .env can't get value from key: *${key}`)
        }
    if (!statusLoadENV) throw new Error(`.env undefined some value please check log before this error`) 
    console.log('Load .env success')
})()



module.exports = config