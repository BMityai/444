export default interface LocalStorageRepositoryInterface {
    /**
     * Get config
     */
     getConfig(): Promise<any>;
     createOrUpdateContent(content): Promise<any>;
}
