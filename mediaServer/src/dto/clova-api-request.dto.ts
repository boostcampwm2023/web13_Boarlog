export const ClovaApiRequest =(url: any, code: string) =>{    
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-CLOVASPEECH-API-KEY', process.env.CLOVA_API_KEY as string);
    return {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            language: process.env.CLOVA_API_LANGUAGE,
            completion: process.env.CLOVA_API_COMPLETION,
            url: url,
            callback: `${process.env.SERVER_API_URL}/lecture/${code}/text`
        })
    }
}
