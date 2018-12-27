const electron = require('electron');
const {app, BrowserWindow} = electron;
const path = require('path');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: process.env.NODE_ENV === 'production' ? true: false,
      allowRunningInsecureContent: false
    },
  });

  let mainURL = "http://localhost:8080";

  if(process.env.NODE_ENV === 'production') {
    mainURL = 'file://' + path.join(__dirname, '../index.html');
  } else 
    mainWindow.webContents.openDevTools();

  mainWindow.loadURL(mainURL);
}

app.on('ready', createWindow);

app.on('quit', () => {
  mainWindow = null;
});

app.on("window-all-closed", () => {
  if( process.platform === "darwin")
    app.quit();
});