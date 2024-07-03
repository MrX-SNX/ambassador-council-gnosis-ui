import { isHexString, toUtf8String } from 'ethers/lib/utils';

const areStringsEqual = (a: string, b: string, caseSensitive = false) => {
  if (caseSensitive) {
    return a === b;
  }

  return a.toLowerCase() === b.toLowerCase();
};

/**
 * If message is a hex value and is Utf8 encoded string we decode it, else we return the raw message
 * @param {string} message raw input message
 * @returns {string}
 */
const tryHexBytesToUtf8 = (message: string): string => {
  if (isHexString(message)) {
    // If is a hex string we try to extract a message
    try {
      return toUtf8String(message);
    } catch (e) {
      // the hex string is not UTF8 encoding so we will return the raw message.
    }
  }

  return message;
};

export { areStringsEqual, tryHexBytesToUtf8 };
