import { TemplateType } from '../../Enums';
import { Field } from '../../Interfaces';
import { Template, TemplatePayload } from '../Template';

export function stringifyFacebookDate(date: Date): string {
  const isoString = date.toISOString();
  // remove ms & Z
  return isoString.substr(0, isoString.length - 5);
}

export type AirlineTemplateOptions = Omit<AirlineTemplatePayload, 'template_type'>;

export interface AirlineTemplatePayload extends TemplatePayload<TemplateType.Airline> {
  intro_message: string;
  locale: string;
  theme_color?: string;
  boarding_pass: BoardingPass[];
}

export interface BoardingPass {
  passenger_name: string;
  pnr_number: string;
  travel_class?: string;
  seat?: string;
  auxiliary_fields?: Field[];
  secondary_fields?: Field[];
  logo_image_url: string;
  header_image_url?: string;
  header_text_field?: string;
  qr_code?: string;
  barcode_image_url?: string;
  above_bar_code_image_url?: string;
  flight_info: FlightInfo;
}

export interface FlightInfo {
  flight_number: string;
  departure_airport: DepartureAirport;
  arrival_airport: Airport;
  flight_schedule: FlightSchedule;
}

export interface Airport {
  airport_code: string;
  city: string;
}

export interface DepartureAirport extends Airport {
  terminal: string;
  gate: string;
}

export interface FlightSchedule {
  // ISO date-string
  boarding_time?: string;
  departure_time: string;
  arrival_time?: string;
}

export class AirlineTemplate extends Template<AirlineTemplatePayload> {}
