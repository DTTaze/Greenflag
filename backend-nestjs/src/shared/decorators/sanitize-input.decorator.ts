import { Transform, TransformFnParams } from 'class-transformer';
import * as sanitizeHtml from 'sanitize-html';

import { BadRequestException } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const escapeHTMLFn = require('escape-html');

export function SanitizeInput(options?: {
  escapeHTML?: boolean;
  sanitizeHTML?: boolean;
}): PropertyDecorator {
  return Transform((params: TransformFnParams) => {
    const value = params.value;

    if (!value) {
      return value;
    }

    if (typeof value !== 'string') {
      throw new BadRequestException('value must be of type string');
    }

    const { escapeHTML = true, sanitizeHTML = true } = options || {};

    if (escapeHTML && sanitizeHTML) {
      return escapeHTMLFn(
        sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }),
      );
    } else if (escapeHTML) {
      return escapeHTMLFn(value);
    } else if (sanitizeHTML) {
      return sanitizeHtml(value, {
        allowedTags: [],
        allowedAttributes: {},
      });
    }

    return value;
  });
}

export function OnlyTextAndNumbers(
  options: {
    includeWhitespaces: boolean;
    onlyASCII: boolean;
    throwOnError: boolean;
    allowedSymbols?: boolean;
  } = {
    includeWhitespaces: true,
    onlyASCII: false,
    throwOnError: true,
    allowedSymbols: false,
  },
): PropertyDecorator {
  return Transform((params: TransformFnParams) => {
    const value = params.value;
    const propertyName = params.key;

    if (!value) {
      return value;
    }

    if (typeof value !== 'string') {
      throw new BadRequestException(
        `Property "${propertyName}" must be a string.`,
      );
    }

    let characterSet = options.onlyASCII ? 'a-zA-Z0-9' : '\\p{L}\\p{N}';

    if (options?.includeWhitespaces) {
      characterSet += options.onlyASCII ? ' ' : '\\s';
    }

    if (options?.allowedSymbols) {
      characterSet += '@\\.\\-\\_\\+';
    }

    const flags = 'g' + (options.onlyASCII ? '' : 'u');

    const sanitizeRegexp = new RegExp(`[^${characterSet}]`, flags);

    const sanitized = value.replace(sanitizeRegexp, '');

    if (sanitized !== value && options.throwOnError) {
      throw new BadRequestException('must only contain text and numbers');
    }

    return sanitized;
  });
}

export function TrimAndLowercase(options?: {
  each?: boolean;
}): PropertyDecorator {
  return Transform((params: TransformFnParams) => {
    const { value } = params;

    if (options?.each && Array.isArray(value)) {
      return value.map((v) =>
        typeof v === 'string' ? v.trim().toLowerCase() : v,
      );
    }

    return typeof value === 'string' ? value.trim().toLowerCase() : value;
  });
}
