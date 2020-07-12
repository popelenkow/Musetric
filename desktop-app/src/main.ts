import { app, BrowserWindow, ipcMain, globalShortcut, Menu } from 'electron'
import { PythonShell } from 'python-shell'
import { channels, WindowEvent } from './channels'
import url from 'url'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
const isDev = process.env.NODE_ENV === 'development'

app.whenReady().then(() => {
	ipcMain.handle(channels.mainWindow, async (electronEvent, event: WindowEvent) => {
		const window = BrowserWindow.fromId(electronEvent.sender.id);
		if (event == 'close') isDev ? window.destroy() : window.close()
		else if (event == 'minimize') window.minimize()
		else if (event == 'maximize') window.maximize()
		else if (event == 'unmaximize') window.unmaximize()
	})
	
	isDev && ipcMain.handle(channels.pytest, async () => {
		return await new Promise((resolve) => {
			PythonShell.run('background/hello.py', undefined, (err, results) =>  {
				resolve({ message: 'python complete', results, err })
			});
		})
	})

	const window = new BrowserWindow({
		width: 1200,
		height: 600,
		minWidth: 300,
		minHeight: 300,
		icon: 'icon.ico',
		webPreferences: {
			nodeIntegration: true
		},
		frame: false
	});

	const query = {
		"theme": "dark"
	}
	isDev
		? window.loadURL(url.format({ pathname: 'http://localhost:8080', query }))
		: window.loadFile('dist/index.html', { query })


	globalShortcut.register('Ctrl+Q', () => isDev ? window.destroy() : window.close())
	isDev && globalShortcut.register('F5', () => window.reload())
	isDev && Menu.setApplicationMenu(Menu.buildFromTemplate([{ label: 'File', submenu:[{ label: 'devTools', accelerator: 'F12', click: () => window.webContents.toggleDevTools() }]} ])) // ToDo https://github.com/electron/electron/issues/5066
	isDev && window.webContents.toggleDevTools();
	
	window.on('maximize', () => window.webContents.send(channels.onMaximizeWindow, true))
	window.on('unmaximize', () => window.webContents.send(channels.onMaximizeWindow, false))
	window.on('closed', () => app.quit())
})




