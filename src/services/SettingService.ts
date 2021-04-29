import { SettingRepository } from "../repositories/SettingRepository"
import { getCustomRepository, Repository } from "typeorm"
import { Setting } from "../entities/Setting"

interface ISettingService {
    chat: boolean;
    username: string;
}

class SettingService {
    private settingRepository: Repository<Setting>

    constructor() {
        this.settingRepository = getCustomRepository(SettingRepository)
    }

    async create({ chat, username }: ISettingService) {

        const isUserExist = await this.settingRepository.findOne({
            username
        })

        if (isUserExist) {
            throw new Error("User already exists!")
        }

        const settings = this.settingRepository.create({ chat, username });

        await this.settingRepository.save(settings);
    }

    async findByUsername(username: string) {
        const settings = await this.settingRepository.findOne({ username })

        return settings
    }

    async update(username: string, chat: boolean) {
        await this.settingRepository.createQueryBuilder()
            .update(Setting)
            .set({ chat })
            .where("username = :username", {
                username
            })
            .execute()
    }
}

export { SettingService }