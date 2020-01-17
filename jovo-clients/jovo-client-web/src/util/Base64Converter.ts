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
      for (let i = 0; i < byteChars.length; i++) {
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
}
