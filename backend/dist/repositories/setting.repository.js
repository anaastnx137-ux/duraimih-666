"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingRepository = exports.SettingRepository = void 0;
const base_repository_1 = require("./base.repository");
class SettingRepository extends base_repository_1.BaseRepository {
    constructor() {
        super('websiteSetting');
    }
    async getSettingsKeyValueMap() {
        const settings = await this.findMany();
        const map = {};
        settings.forEach(s => {
            map[s.key] = s.value;
        });
        return map;
    }
}
exports.SettingRepository = SettingRepository;
exports.settingRepository = new SettingRepository();
