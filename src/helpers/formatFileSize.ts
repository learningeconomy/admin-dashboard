export default function formatBytes(bytes: number, decimals = 0): string {
    if (bytes === 0) return '0 bytes';
  
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [' bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    return `${parseFloat((bytes / (k ** i)).toFixed(dm))}${sizes[i]}`;
  }
  