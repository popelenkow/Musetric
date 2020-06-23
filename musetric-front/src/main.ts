import { app, BrowserWindow, Menu, MenuItemConstructorOptions, ipcMain } from 'electron'
import { PythonShell } from 'python-shell'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

app.on('ready', () => {
	let win = new BrowserWindow({
		width: 800,
		height: 600,
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

ipcMain.on('main-request', (event, arg) => {
	PythonShell.run('background/hello.py',  undefined, (err, results) =>  {
		event.reply('main-complete', { message: 'python complete', results, err })
	});
})


if (process.env.NODE_ENV === 'development') {
	mainMenuTemplate.push({
		label: 'Developer Tools',
		submenu: [
		{
			label: 'Toggle DevTools',
			accelerator: 'F12',
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