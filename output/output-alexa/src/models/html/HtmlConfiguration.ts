import { IsInt, Max, Min } from '@jovotech/output';
import { HTML_CONFIGURATION_TIMEOUT_MAX, HTML_CONFIGURATION_TIMEOUT_MIN } from '../../constants';

export class HtmlConfiguration {
  @IsInt()
  @Min(HTML_CONFIGURATION_TIMEOUT_MIN)
  @Max(HTML_CONFIGURATION_TIMEOUT_MAX)
  timeoutInSeconds: number;
}
