import { Color, Titlebar } from "custom-electron-titlebar";
import { ipcRenderer } from "electron";

window.addEventListener('DOMContentLoaded', () => {
    const titlebar = new Titlebar({
        backgroundColor: Color.fromHex("#23232d"),
        onMinimize: () => ipcRenderer.send('window-minimize'),
        onMaximize: () => ipcRenderer.send('window-maximize'),
        onClose: () => ipcRenderer.send('window-close'),
        isMaximized: () => ipcRenderer.sendSync('window-is-maximized'),
        onMenuItemClick: () => { },
    });

    titlebar.updateTitle("Deezer");

    document.querySelector('head')?.appendChild(getCustomCssElement());
    const headerInterval = setInterval(() => {
        const header = document.querySelector('.page-sidebar .sidebar-header');
        if (header) {
            const navigationElements = getNavigationElements();
            header.insertBefore(navigationElements, header.firstChild);
            clearInterval(headerInterval);
        }
    }, 100)
});


const getCustomCssElement = () => {
    let element = document.createElement("style");
    element.innerHTML = `
        .cet-titlebar {
            background-color: var(--background-secondary) !important;
            color: var(--text-primary);
        }
        .cet-icon svg {
            display: inline;
            fill: var(--text-primary) !important;
        }
        #page_sidebar, #page_topbar {
            top: 30px;
        }
        .page-sidebar .sidebar-header .sidebar-header-logo {
            display: none;
        }
        .page-sidebar .sidebar-header .custom-navigation {
            padding: 12px;
            padding-bottom: 0;
        }
        .page-sidebar .sidebar-header .custom-navigation-btn {
            display: inline-block;
            padding: 5px;
            cursor: pointer;
            font-weight: bold;
            font-size: 1.5rem;
        }
    `;
    return element;
};

const getNavigationElements = () => {
    const forwardSvg = `<svg viewBox="0 0 16 16" width="16" height="16" focusable="false" role="img" aria-hidden="true" class="sk__sc-1vdzswr-0 jFctkk"><g><path d="M11.5 8 5.223 2l-.723.691L10.055 8 4.5 13.309l.723.691L11.5 8z"></path></g></svg>`;
    const backSvg = `<svg viewBox="0 0 16 16" width="16" height="16" focusable="false" role="img" aria-hidden="true" class="sk__sc-1vdzswr-0 jFctkk"><g><path d="m4.5 8 6.277-6 .723.691L5.946 8l5.554 5.309-.723.691L4.5 8z"></path></g></svg>`;
    const parentElement = document.createElement('div');
    parentElement.classList.add('custom-navigation');

    const backElement = document.createElement('div');
    backElement.classList.add('custom-navigation-btn');
    backElement.innerHTML = backSvg;
    backElement.addEventListener('click', () => {
        history.back();
    });
    parentElement.appendChild(backElement);

    const forwardElement = document.createElement('div');
    forwardElement.classList.add('custom-navigation-btn');
    forwardElement.innerHTML = forwardSvg;
    forwardElement.addEventListener('click', () => {
        history.forward();
    });
    parentElement.appendChild(forwardElement);

    return parentElement;
};
