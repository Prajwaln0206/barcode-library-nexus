
import JsBarcode from 'jsbarcode';

/**
 * Generates a barcode image as a data URL
 * @param value - The value to generate a barcode for
 * @returns Data URL of the generated barcode image
 */
export const generateBarcode = (value: string): string => {
  const canvas = document.createElement('canvas');
  
  try {
    JsBarcode(canvas, value, {
      format: "CODE128",
      displayValue: true,
      fontSize: 14,
      height: 60,
      margin: 10,
    });
    
    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error('Error generating barcode:', error);
    return '';
  }
};

/**
 * Generates a unique barcode based on the provided ID and prefix
 * @param id - The unique identifier to include in the barcode
 * @param prefix - Optional prefix for the barcode (defaults to 'LIB')
 * @returns String representation of the generated barcode
 */
export const generateUniqueBarcode = (id: string, prefix = 'LIB'): string => {
  // Create a barcode with format PREFIX-ID-CHECKSUM
  const baseCode = `${prefix}-${id}`;
  
  // Simple checksum calculation (sum of char codes mod 97)
  const checksum = baseCode
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0) % 97;
  
  return `${baseCode}-${checksum.toString().padStart(2, '0')}`;
};

/**
 * Validates a barcode by verifying its checksum
 * @param barcode - The barcode string to validate
 * @returns Boolean indicating whether the barcode is valid
 */
export const validateBarcode = (barcode: string): boolean => {
  const parts = barcode.split('-');
  
  // Ensure we have the prefix, id, and checksum parts
  if (parts.length !== 3) {
    console.log('Barcode validation failed: incorrect number of parts', parts.length);
    return false;
  }
  
  const [prefix, id, checksumStr] = parts;
  
  // Validate checksum is a number
  if (!/^\d+$/.test(checksumStr)) {
    console.log('Barcode validation failed: checksum is not a number', checksumStr);
    return false;
  }
  
  const checksum = parseInt(checksumStr, 10);
  
  // Recalculate the checksum
  const baseCode = `${prefix}-${id}`;
  const expectedChecksum = baseCode
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0) % 97;
  
  const isValid = checksum === expectedChecksum;
  
  if (!isValid) {
    console.log(`Barcode validation failed: expected checksum ${expectedChecksum}, got ${checksum}`);
  }
  
  return isValid;
};
