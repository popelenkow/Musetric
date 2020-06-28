import { app, BrowserWindow, Menu, MenuItemConstructorOptions, ipcMain } from 'electron'
import { PythonShell } from 'python-shell'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

app.on('ready', () => {
	let win = new BrowserWindow({
		width: 800,
		height: 600,
		minWidth: 300,
		minHeight: 300,
		webPreferences: {
			nodeIntegration: true
		},
		frame: false
	});
	
	process.env.NODE_ENV === 'development'
		? win.loadURL('http://localhost:8080')
		: win.loadFile('dist/index.html');

	process.env.NODE_ENV === 'development' && win.webContents.toggleDevTools();  
	win.on('closed', () => { app.quit() })
	Menu.setApplicationMenu(Menu.buildFromTemplate(mainMenuTemplate))
});

const mainMenuTemplate: Array<MenuItemConstructorOptions> = [{
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
}]

ipcMain.handle('main-invoke', async (event, arg) => {
	return await new Promise((resolve, reject) => {
		PythonShell.run('background/hello.py', undefined, (err, results) =>  {
			resolve({ message: 'python complete', results, err })
		});
	})
	
})


if (process.env.NODE_ENV === 'development') {
	mainMenuTemplate.push({
		label: 'Developer Tools',
		submenu: [
		{
			label: 'Toggle DevTools',
			accelerator: 'F12',
			click(item, focusedWindow) {
				if (focusedWindow) {
					focusedWindow.webContents.toggleDevTools();
				}
			}
		},
		{
			role: 'reload',
			accelerator: 'F5'
		}
		]
	})
}