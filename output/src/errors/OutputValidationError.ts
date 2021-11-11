import { formatValidationErrors, ValidationError } from '..';

export class OutputValidationError extends Error {
  constructor(readonly validationErrors: ValidationError[], readonly prefix = '') {
    super();
    this.message = formatValidationErrors(validationErrors, {
      text: `${prefix}ValidationErrors:`,
    });
  }
}
