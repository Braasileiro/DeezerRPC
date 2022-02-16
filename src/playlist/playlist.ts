export function registerContextMenu() {
    __mainWindow.webContents.executeJavaScript(
        `window.oncontextmenu = (event) => {
            if (event.target.closest('#page_naboo_playlist')) {
                const songRow = event.target.closest('[role="row"]');
                songRow.querySelector('.popper-wrapper button').click();
                return false;
            }
        };0`
    );
}
