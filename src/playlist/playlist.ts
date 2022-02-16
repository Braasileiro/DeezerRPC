const contextMenuScript = `
window.oncontextmenu = (e) => {
    if (e.target.closest('#page_naboo_playlist')) {
        const songRow = e.target.closest('[role="row"]');
        songRow.querySelector('.popper-wrapper button').click();
        return false;
    }
}
`;

export function registerContextMenu() {
    __mainWindow.webContents.executeJavaScript(contextMenuScript);
}
