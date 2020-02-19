/*
**  Nuxt
*/
const http = require('http');
const { Nuxt, Builder } = require('nuxt');
const config = require('./nuxt.config.js');
config.rootDir = __dirname; // for electron-builder
// Init Nuxt.js
const nuxt = new Nuxt(config);
const builder = new Builder(nuxt);
const server = http.createServer(nuxt.render);
// Build only in dev mode
if (config.dev) {
	builder.build().catch(err => {
		console.error(err); // eslint-disable-line no-console
		process.exit(1);
	});
}
// Listen the server
server.listen();
const _NUXT_URL_ = `http://localhost:${server.address().port}`;
console.log(`Nuxt working on ${_NUXT_URL_}`);

/*
** Electron
*/
const { app, BrowserWindow } = require('electron');
const path = require('path');
const createWindow = () => {
let	win = new BrowserWindow({
		icon: path.join(__dirname, 'static/icon.png'),
		webPreferences: {
			nodeIntegration: true,
      webSecurity: process.env.NODE_ENV === 'production',
      allowRunningInsecureContent: false,
    },
	});
	win.maximize();
	win.on('closed', () => win = null);
	if (config.dev) {
		// Install vue dev tool and open chrome dev tools
		const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer');
		installExtension(VUEJS_DEVTOOLS.id).then(name => {
			console.log(`Added Extension:  ${name}`);
			win.webContents.openDevTools();
		}).catch(err => console.log('An error occurred: ', err));
		// Wait for nuxt to build
		const pollServer = () => {
			http.get(_NUXT_URL_, (res) => {
				if (res.statusCode === 200) { win.loadURL(_NUXT_URL_); } else { setTimeout(pollServer, 300); }
			}).on('error', pollServer);
		};
		pollServer();
	} else { return win.loadURL(_NUXT_URL_); }
};
app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
