import { Router } from "express"
import { MessageController } from "./controllers/MessageController";
import { SettingController } from "./controllers/SettingController"
import { UserController } from "./controllers/UserController"

const router = Router()

router.post("/user", UserController.create);

router.post("/message", MessageController.create);
router.get("/message/:user_id", MessageController.showByUser);

router.post("/setting", SettingController.create);
router.get("/setting/:username", SettingController.findByUsername)
router.put("/setting/:username", SettingController.update)

export { router };