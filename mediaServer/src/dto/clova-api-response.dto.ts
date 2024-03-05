export class ClovaApiReponse {
    result:string;
    message: string;
    timestamp: string;
    
    constructor(result:string, message:string, timestamp:string) {
        this.result = result;
        this.message = message;
        this.timestamp = timestamp;
    }
}