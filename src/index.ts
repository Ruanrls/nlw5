import { httpServer } from './app'
import "./websocket/client"
import "./websocket/admin"

httpServer.listen(8080, () => {

    console.log(`Running at 8080`)

});