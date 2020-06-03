const WINDOWS_PLATFORMS = ['Win32', 'Win64', 'Windows', 'WinCE'];

export class OSHelper {
  static get isWindows(): boolean {
    return WINDOWS_PLATFORMS.includes(navigator.platform);
  }
}
