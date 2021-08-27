import { APP_CONFIG } from '../app/app';
import settings from 'electron-settings';

export function getPreference<T>(key: string): T | any {
    return APP_CONFIG.get(key);
}

export function setPreference(key: string, value: any): any {
    settings.setSync(key, value);
    return APP_CONFIG.set(key, value);
}
