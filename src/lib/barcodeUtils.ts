
import JsBarcode from 'jsbarcode';

/**
 * Generates SVG barcode HTML from a given value
 * @param value - The value to generate a barcode for
 * @returns SVG HTML string of the barcode
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
 * Validates a barcode
 */
export const validateBarcode = (barcode: string): boolean => {
  const parts = barcode.split('-');
  
  // Ensure we have the prefix, id, and checksum parts
  if (parts.length !== 3) return false;
  
  const [prefix, id, checksumStr] = parts;
  const checksum = parseInt(checksumStr, 10);
  
  // Recalculate the checksum
  const baseCode = `${prefix}-${id}`;
  const expectedChecksum = baseCode
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0) % 97;
  
  return checksum === expectedChecksum;
};
