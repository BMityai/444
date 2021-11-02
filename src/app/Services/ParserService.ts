import LoggerService from "sosise-core/build/Services/Logger/LoggerService";
import LocalStorageRepositoryInterface from "../Repositories/LocalStorageRepositoryInterface";
import puppeteer from "puppeteer";
export default class ParserService {

    /**
     * LocalStorageRepositoryInterface
     */
    localStorageRepository: LocalStorageRepositoryInterface

    /**
     * LoggerService
     */
    loggerService: LoggerService

    /**
     * 
     * @param localStorageRepository 
     * @param loggerService 
     */
    constructor(localStorageRepository: LocalStorageRepositoryInterface, loggerService: LoggerService) {
        this.localStorageRepository = localStorageRepository;
        this.loggerService = loggerService;
    }

    public async parse() {
        this.loggerService.info('start');
        const config = await this.localStorageRepository.getConfig();
        
        for (const item of config) {
            const content = await this.getContent(item);
            await this.localStorageRepository.createOrUpdateContent(content);
        }
        
    }

  
    /**
     * Get content
     */
    private async getContent(item) {
        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium-browser', //@todo uncomment before release
            args: ["--no-sandbox"]
        });

        try {
            const page = (await browser.pages())[0];
            await page.setExtraHTTPHeaders({
                'Accept-Language': 'en'
            });
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36');

            await page.goto(item.url, {
                waitUntil: 'load',
            });
            await page.waitFor(4000)

            // this.loggerService.info(await page.content())
            var content = await page.$eval(item.selector, el => el.textContent);
            if (content) content = content.substr(1);

            if (content) content = content.replace(',', '');
            if (content) content = content.replace('.', ',');
            browser.close();
            return { id: item.id, content: content };
        } catch {
            browser.close();
        }



    }

    /**
     * 
     */
    protected async createOrUpdatePerItem(contents) {
        const createOrUpdatePromise = new Array();
        for (const content of contents) {
            if (content.status != 'fulfilled') continue;

            createOrUpdatePromise.push(this.localStorageRepository.createOrUpdateContent(content.value));
        }
        await Promise.allSettled(createOrUpdatePromise);
    }
}
