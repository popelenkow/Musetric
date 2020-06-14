import { app, BrowserWindow, Menu, MenuItemConstructorOptions } from 'electron'
import { PythonShell } from 'python-shell'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

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

  process.env.NODE_ENV === 'development' && win.webContents.toggleDevTools();  
  win.on('closed', () => { app.quit() })
  Menu.setApplicationMenu(Menu.buildFromTemplate(mainMenuTemplate))
});

const mainMenuTemplate: Array<MenuItemConstructorOptions> = [
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

PythonShell.run('scripts/hello.py',  undefined, (err, results) =>  {
  if (err) console.log(err)
  console.log('python success', results);
});

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