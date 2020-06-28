import { app, BrowserWindow, Menu, MenuItemConstructorOptions, ipcMain } from 'electron'
import { PythonShell } from 'python-shell'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

app.on('ready', () => {
	let window = new BrowserWindow({
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
		? window.loadURL('http://localhost:8080')
		: window.loadFile('dist/index.html');

	process.env.NODE_ENV === 'development' && window.webContents.toggleDevTools();
	window.on('maximize', () => window.webContents.send('on-maximize-window', true))
	window.on('unmaximize', () => window.webContents.send('on-maximize-window', false))
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

ipcMain.handle('main-window', async (info, event) => {
	const window = BrowserWindow.fromId(info.sender.id);
	if (event == 'close') window.close();
	else if (event == 'minimize') window.minimize();
	else if (event == 'maximize') window.maximize();
	else if (event == 'unmaximize') window.unmaximize();
})

ipcMain.handle('pytest', async () => {
	return await new Promise((resolve) => {
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