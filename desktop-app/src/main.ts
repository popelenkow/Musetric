import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { PythonShell } from 'python-shell'
import { channels, WindowEvent } from './channels'

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
	
	ipcMain.handle(channels.pytest, async () => {
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
		webPreferences: {
			nodeIntegration: true
		},
		frame: false
	});

	isDev ? window.loadURL('http://localhost:8080') : window.loadFile('dist/index.html');

	globalShortcut.register('Ctrl+Q', () => isDev ? window.destroy() : window.close())
	isDev && globalShortcut.register('F12', () => window.webContents.toggleDevTools())
	isDev && window.webContents.toggleDevTools();
	isDev && window.setIcon('resources/icon.ico')
	
	
	window.on('maximize', () => window.webContents.send(channels.onMaximizeWindow, true))
	window.on('unmaximize', () => window.webContents.send(channels.onMaximizeWindow, false))
	window.on('closed', () => app.quit())
})




