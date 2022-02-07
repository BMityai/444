import Database from 'sosise-core/build/Database/Database';
import LocalStorageRepositoryInterface from './LocalStorageRepositoryInterface';
import { Knex } from 'knex';
import Helper from 'sosise-core/build/Helper/Helper';

export default class LocalStorageRepository implements LocalStorageRepositoryInterface {

    private dbClient: Knex;

    /**
     * Constructor
     */
    constructor() {
        this.dbClient = Database.getConnection(process.env.DB_PROJECT_CONNECTION as string).client;
    }

    /**
     * Get all customers
     */
    public async getConfig(): Promise<any> {
        // Get rows
        return await this.dbClient.table('config');
    }

    /**
     * Create or update content
     */
    public async createOrUpdateContent(content): Promise<any> {

        if(content.content == 0) {
            return
        }

        const currentContent = await this.getContentByConfigId(content.id);
        if (!currentContent.length) {
            await this.createContent(content);
        } else {
            await this.updateContent(content);
        }
    }

    private async updateContent(content) {
        await this.dbClient.table('content')
            .where('config_id', content.id)
            .update({
                content: content.content,
                updated_at: Helper.getCurrentDateTime()
            })
    }

    private async createContent(content) {
        await this.dbClient.table('content')
            .insert({
                config_id: content.id,
                content: content.content,
                created_at: Helper.getCurrentDateTime(),
                updated_at: Helper.getCurrentDateTime(),
            })
    }

    private async getContentByConfigId(configId) {
        return await this.dbClient.table('content')
            .where('config_id', configId);

    }
}
