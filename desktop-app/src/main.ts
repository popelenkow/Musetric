import { app, BrowserWindow, Menu, MenuItemConstructorOptions, ipcMain } from 'electron'
import { PythonShell } from 'python-shell'
import { channels, WindowEvent } from './channels'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
const isDev = process.env.NODE_ENV === 'development'

app.on('ready', () => {
	let window = new BrowserWindow({
		width: 1200,
		height: 600,
		minWidth: 300,
		minHeight: 300,
		webPreferences: {
			nodeIntegration: true
		},
		frame: false
	});

	isDev ? window.loadURL('http://localhost:8080') : window.loadFile('dist/index.html');

	isDev && window.setIcon('resources/icon.ico')
	isDev && window.webContents.toggleDevTools();
	
	window.on('maximize', () => window.webContents.send(channels.onMaximizeWindow, true))
	window.on('unmaximize', () => window.webContents.send(channels.onMaximizeWindow, false))
	window.on('closed', () => app.quit())
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

ipcMain.handle(channels.mainWindow, async (electronEvent, event: WindowEvent) => {
	const window = BrowserWindow.fromId(electronEvent.sender.id);
	if (event == 'close') isDev ? window.destroy() : window.close()
	else if (event == 'minimize') window.minimize()
	else if (event == 'maximize') window.maximize()
	else if (event == 'unmaximize') window.unmaximize()
})

ipcMain.handle(channels.pytest, async () => {
	return await new Promise((resolve) => {
		PythonShell.run('background/hello.py', undefined, (err, results) =>  {
			resolve({ message: 'python complete', results, err })
		});
	})
	
})


if (isDev) {
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