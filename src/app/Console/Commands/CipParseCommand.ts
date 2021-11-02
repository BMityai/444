import commander from 'commander';
import BaseCommand, { OptionType } from 'sosise-core/build/Command/BaseCommand';
import IOC from 'sosise-core/build/ServiceProviders/IOC';
import ParserService from '../../Services/ParserService';

export default class CipParseCommand extends BaseCommand {
    /**
     * Command name
     */
    protected signature: string = 'cip:parse';

    /**
     * Command description
     */
    protected description: string = 'Coin info parse';

    /**
     * When command is executed prevent from double execution
     */
    protected singleExecution: boolean = true;

    /**
     * Command options
     */
    protected options: OptionType[] = [];

    /**
     * Execute the console command
     */
    public async handle(cli: commander.Command): Promise<void> {
        const service = IOC.make(ParserService) as ParserService;
        await service.parse();
    }
}
