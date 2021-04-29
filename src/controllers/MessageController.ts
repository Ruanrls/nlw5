import { Request, Response } from "express"
import { MessageService } from "../services/MessageService"

class MessageController {

    static async create(req: Request, res: Response) {
        const { admin_id, message, user_id } = req.body

        const messageService = new MessageService()

        const msgm = await messageService.create({
            admin_id,
            message,
            user_id,
        })

        res.json(msgm)
    }

    static async showByUser(req: Request, res: Response) {
        const messageService = new MessageService()

        const { user_id } = req.params;


        const msgs = await messageService.listByUser(user_id)

        res.json(msgs)
    }
}

export { MessageController }