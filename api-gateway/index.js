const server = require('express')()

const config = require('./src/configs')
const PORT = config.env.SERVER_PORT


server.use(require('./src/app'))
server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))