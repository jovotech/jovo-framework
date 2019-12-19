export interface BespokenLogObject {
  log_type: string;
  payload: Record<string, any>;
  tags: string[];
  timestamp: Date;
}

export interface BespokenLogPayload {
  logs: BespokenLogObject[];
  source: string;
  transaction_id: string;
}
