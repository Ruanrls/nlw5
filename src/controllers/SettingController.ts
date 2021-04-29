import { Request, Response } from "express"
import { SettingService } from "../services/SettingService"

class SettingController {

    static async create(req: Request, res: Response) {
        const { chat, username } = req.body

        const service = new SettingService()

        try {

            let createResponse = await service.create({ chat, username })
            res.json(createResponse)
            console.log("entrou aqui")

        } catch (err) {
            res.status(400).json({ message: err.message })
            console.log("entrou aqui2")

        }

    }

    static async findByUsername(req: Request, res: Response) {
        const { username } = req.params

        const service = new SettingService()

        const setting = await service.findByUsername(username)

        res.json(setting)
    }

    static async update(req: Request, res: Response) {
        const { username } = req.params
        const { chat } = req.body

        const service = new SettingService()

        const updated = await service.update(username, chat)

        res.json(updated)
    }
}

export { SettingController }