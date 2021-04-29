import { socketServer } from "../app"
import { ConnectionService } from "../services/ConnectionService"
import { MessageService } from "../services/MessageService"
import { UserService } from "../services/UserService"

socketServer.on("connect", (socket) => {
    const connectionService = new ConnectionService()
    const userService = new UserService()
    const messageService = new MessageService()

    let user_id = null

    socket.on("client_access", async (params) => {

        const socket_id = socket.id

        const { message, email } = params;

        const userExist = await userService.findByEmail(email);

        if (!userExist) {
            const newUser = await userService.create(email)
            user_id = newUser.id

            await connectionService.create({
                socket_id,
                user_id
            })

        } else {
            user_id = userExist.id

            const connection = await connectionService.findByUserId(userExist.id)

            if (!connection) {
                await connectionService.create({
                    socket_id,
                    user_id
                })
            } else {
                connection.socket_id = socket_id;

                await connectionService.create({
                    socket_id,
                    user_id,
                    id: connection.id
                })
            }
        }

        await messageService.create({
            message,
            user_id
        })

        const messages = await messageService.listByUser(user_id)

        socket.emit("client_list_messages", messages)
    })


    socket.on("client_send_to_admin", async params => {
        const { message, socketAdmin } = params
        const idCurrentSocket = socket.id

        const id = await connectionService.findByUserSocket(idCurrentSocket)

        await messageService.create({ message, user_id: id })

        socketServer.to(socketAdmin).emit("admin_receive_message", {
            message,
            socket_id: idCurrentSocket,
            user_id: id
        })
    })
})