import { Socket } from "socket.io"
import { socketServer } from "../app"
import { ConnectionService } from "../services/ConnectionService"
import { MessageService } from "../services/MessageService"

socketServer.on("connect", async (socket) => {

    const connectionService = new ConnectionService()
    const messageService = new MessageService()

    const connectionWithoutAdmin = await connectionService.showFreeConnections()

    socketServer.emit("admin_list_all_users", connectionWithoutAdmin)

    socket.on("admin_list_user_messages", async (params, callback) => {

        const { user_id } = params


        const messages = await messageService.listByUser(user_id)

        callback(messages)
    })

    socket.on("admin_send_message", async params => {
        const { user_id, message } = params

        await messageService.create({
            message,
            user_id,
            admin_id: socket.id
        })

        const { socket_id } = await connectionService.findByUserId(user_id)

        socketServer.to(socket_id).emit("admin_send_to_client", {
            message,
            socket_id: socket.id
        })
    })
})