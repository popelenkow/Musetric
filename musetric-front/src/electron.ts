import { app, BrowserWindow, Menu, MenuItemConstructorOptions, MenuItem } from 'electron'
 
app.on('ready', () => {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
 
  process.env.NODE_ENV === 'development'
    ? win.loadURL('http://localhost:8080')
    : win.loadFile('dist/index.html');
  win.on('closed', () => { app.quit() })
  Menu.setApplicationMenu(Menu.buildFromTemplate(mainMenuTemplate))
});

const mainMenuTemplate: Array<(MenuItemConstructorOptions) | (MenuItem)> = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item'
      },
      {
        label: 'Clear Items'
      },
      {
        label: 'Quit',
        accelerator: 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
]

if (process.env.NODE_ENV === 'development') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.webContents.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}