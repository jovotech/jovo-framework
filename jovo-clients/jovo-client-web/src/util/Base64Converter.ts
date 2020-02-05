export class Base64Converter {
  static blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();

        reader.onload = () => {
          const result: string = reader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };

        reader.readAsDataURL(blob);
      } catch (e) {
        reject(e);
      }
    });
  }

  static base64ToBlob(base64String: string, contentType: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const byteChars = atob(base64String);
      const byteNumbers = new Array(byteChars.length);
      for (let i = 0, len = byteChars.length; i < len; i++) {
        byteNumbers[i] = byteChars.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      try {
        const blob = new Blob([byteArray], { type: contentType });
        resolve(blob);
      } catch (e) {
        reject(e);
      }
    });
  }

  static arrayBufferToBase64(buffer: ArrayBuffer): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const length = bytes.byteLength;
      for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      resolve(btoa(binary));
    });
  }

  static base64ToArrayBuffer(base64String: string): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const binaryString = atob(base64String);
      const length = binaryString.length;
      const bytes = new Uint8Array(length);
      for (let i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      resolve(bytes.buffer);
    });
  }
}
