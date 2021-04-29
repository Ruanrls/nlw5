import { getCustomRepository, Repository } from "typeorm"
import { Connection } from "../entities/Connection"
import { ConnectionRepository } from "../repositories/ConnectionRepository"

interface ISocketOptions {

    socket_id: string;

    user_id: string;

    admin_id?: string;

    id?: string;
}

class ConnectionService {

    private connectionRepository: Repository<Connection>

    constructor() {
        this.connectionRepository = getCustomRepository(ConnectionRepository)
    }

    async create({ user_id, admin_id, id, socket_id }: ISocketOptions) {

        let connection = this.connectionRepository.create({
            user_id,
            admin_id,
            id,
            socket_id
        })

        connection = await this.connectionRepository.save(connection);

        return connection;
    }

    async findByUserId(user_id: string) {
        const connection = await this.connectionRepository.findOne({ user_id })

        return connection
    }

    async showFreeConnections() {
        const connection = await this.connectionRepository.find({
            where: {
                admin_id: null
            },
            relations: ["user"]
        })

        return connection
    }

    async findByUserSocket(socket_id: string) {
        const connection = await this.connectionRepository.findOne({
            where: {
                socket_id: socket_id
            },
            relations: ["user"]
        })

        return connection.user.id
    }

    async setAdminId(user_id: string, admin_id: string) {
        await this.connectionRepository.createQueryBuilder()
            .update(Connection)
            .set({ admin_id })
            .where("user_id = :user_id", {
                user_id
            })
            .execute()
    }
}

export { ConnectionService }