/* eslint-disable @typescript-eslint/no-floating-promises */
import { app, BrowserWindow, globalShortcut, Menu } from 'electron';
import { Types } from 'musetric';
import { PythonShell } from 'python-shell';
import url from 'url';
import fs from 'fs';
import { Ipc } from './Ipc';

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
const isDev = process.env.NODE_ENV === 'development';

type Config = {
	theme: Types.Theme,
	locale: Types.Locale,
};

app.whenReady().then(() => {
	Ipc.app.handle((_event, arg) => {
		const appConfig = JSON.parse(fs.readFileSync('app.config.json', 'utf8')) as Config;
		if (arg.type === 'locale') appConfig[arg.type] = arg.value;
		if (arg.type === 'theme') appConfig[arg.type] = arg.value;
		const jsonString = JSON.stringify(appConfig, null, '\t');
		fs.writeFileSync('app.config.json', jsonString, { encoding: 'utf8' });
	});

	Ipc.titlebar.handle((event, arg) => {
		const window = BrowserWindow.fromId(event.sender.id);
		if (!window) return;

		if (arg === 'close') isDev ? window.destroy() : window.close();
		else if (arg === 'minimize') window.minimize();
		else if (arg === 'maximize') window.maximize();
		else if (arg === 'unmaximize') window.unmaximize();
	});

	Ipc.pytest.handle(async () => {
		const result = await new Promise((resolve) => {
			PythonShell.run('background/hello.py', undefined, (err, results) => {
				resolve({ message: 'python complete', results, err });
			});
		});
		return result;
	});

	const window = new BrowserWindow({
		width: 1200,
		height: 600,
		minWidth: 300,
		minHeight: 300,
		icon: 'icon.ico',
		webPreferences: {
			nodeIntegration: true,
		},
		frame: false,
	});

	const query = JSON.parse(fs.readFileSync('app.config.json', 'utf8')) as Config;
	isDev
		? window.loadURL(url.format({ pathname: 'http://localhost:8080', query }))
		: window.loadFile('dist/index.html', { query });

	globalShortcut.register('Ctrl+Q', () => (isDev ? window.destroy() : window.close()));
	isDev && globalShortcut.register('F5', () => window.reload());
	isDev && Menu.setApplicationMenu(Menu.buildFromTemplate([{ label: 'File', submenu: [{ label: 'devTools', accelerator: 'F12', click: () => window.webContents.toggleDevTools() }] }])); // ToDo https://github.com/electron/electron/issues/5066
	isDev && window.webContents.toggleDevTools();

	window.on('maximize', () => Ipc.onWindow.send(window, { isMaximized: true }));
	window.on('unmaximize', () => Ipc.onWindow.send(window, { isMaximized: false }));
	window.on('closed', () => app.quit());
});
