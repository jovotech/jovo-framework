export interface RasaIntent {
    name: string;
    confidence: number;
}
export interface RasaEntity {
    start: number;
    end: number;
    value: string;
    entity: string;
    extractor: string;
    confidence: number;
    processors: any[];
}
export interface RasaResponseSelector {
    response: {
        name: string;
        confidence: number;
    };
    ranking: any[];
}
export interface RasaResponse {
    text: string;
    intent: RasaIntent;
    entities: RasaEntity[];
    intent_ranking: RasaIntent[];
    response_selector: Record<string, RasaResponseSelector>;
}
