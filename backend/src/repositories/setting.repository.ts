import { BaseRepository } from './base.repository';
import { WebsiteSetting } from '@prisma/client';

export class SettingRepository extends BaseRepository<WebsiteSetting> {
    constructor() {
        super('websiteSetting');
    }

    async getSettingsKeyValueMap(): Promise<Record<string, string>> {
        const settings = await this.findMany();
        const map: Record<string, string> = {};
        settings.forEach(s => {
            map[s.key] = s.value;
        });
        return map;
    }
}
export const settingRepository = new SettingRepository();
