export declare class Chat {
    private server;
    constructor(apikey: string);
    codeReview: (patch: string) => Promise<string>;
}
