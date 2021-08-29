import got from 'got';
import { APP } from '../app/app';
import { dialog, shell } from 'electron';
import * as Preferences from '../util/preferences';

export async function checkVersion(fromUser: boolean) {
    try {
        const response = await got(APP.packageUrl, {
            timeout: {
                lookup: 5000
            }
        });

        const json = JSON.parse(response.body);

        if (json.version != APP.version) {
            return dialog.showMessageBox({
                type: 'info',
                buttons: [`Let's fucking go!`, 'Not now...'],
                defaultId: 0,
                title: `${APP.name} Updater`,
                message: `Version ${json.version} is now available!`,
                detail: 'Do you want to be redirected to update?',
                checkboxLabel: `Don't show it again on startup.`,
                checkboxChecked: !Preferences.getPreference<boolean>(APP.preferences.checkUpdates)
            }).then(result => {
                if (result.response == 0) {
                    shell.openExternal(`${json.homepage}/releases/tag/${json.version}`);
                }

                Preferences.setPreference(APP.preferences.checkUpdates, !result.checkboxChecked)
            });
        } else {
            if (fromUser) {
                dialog.showMessageBox({
                    type: 'info',
                    title: `${APP.name} Updater`,
                    message: 'You already have the latest version.'
                });
            }
        }
    } catch (e) {
        console.error(e);
    }
}
