import { getCustomRepository, Repository } from "typeorm"
import { User } from "../entities/User"
import { UserRepository } from "../repositories/UserRepository"

class UserService {

    private userRepository: Repository<User>

    constructor() {
        this.userRepository = getCustomRepository(UserRepository)
    }

    async create(email: string) {
        const UserExist = await this.userRepository.findOne({ email })

        if (UserExist)
            return UserExist

        const user = this.userRepository.create({ email })

        await this.userRepository.save(user)

        return user
    }


    async findByEmail(email: string) {
        const User = await this.userRepository.findOne({ email })

        return User
    }
}
export { UserService }