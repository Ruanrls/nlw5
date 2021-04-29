import { getCustomRepository, Repository } from "typeorm"
import { MessageRepository } from "../repositories/MessageRepository"
import { Message } from "../entities/Message"

interface IMessageCreate {
    admin_id?: string;
    message: string;
    user_id: string;
}

class MessageService {

    private messageRepository: Repository<Message>;

    constructor() {
        this.messageRepository = getCustomRepository(MessageRepository)
    }

    async create({ admin_id, message, user_id }: IMessageCreate) {
        const msg = this.messageRepository.create({
            admin_id,
            message,
            user_id
        })

        await this.messageRepository.save(msg);

        return msg
    }

    async listByUser(user_id: string) {
        const messageList = await this.messageRepository.find({
            user_id

            //inner join
            //where: {user_id}
            //relations: ["user"]
        })

        return messageList
    }
}

export { MessageService }