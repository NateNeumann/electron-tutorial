const { app, BrowserWindow, Menu } = require("electron");
const storage = require("electron-json-storage");
const os = require("os");

storage.setDataPath(os.tmpdir());

let win;
let bgColor;

function createWindow() {
  const dataPath = storage.getDataPath();
  console.log("main:" + dataPath);

  storage.get("preferences", function(error, data) {
    bgColor = data.color;
  });

  win = new BrowserWindow({
    backgroundColor: bgColor,
    width: 800,
    height: 600
  });
  win.loadFile("src/index.html");

  // OPTIONAL: Open the window with DevTools open.
  // win.webContents.openDevTools();

  // Dereference window when closed.
  win.on("closed", () => {
    win = null;
  });

  // win.webContents.executeJavaScript(
  //   console.log("This is a way of accessing the window from index.js.")
  // );

  const menuTemplate = [
    {
      label: app.getName(),
      submenu: [
        {
          label: "Preferences",
          accelerator: "CmdOrCtrl+,",
          click: () => preferencesMenu()
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "delete" },
        { role: "selectall" }
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forcereload" },
        { role: "toggledevtools" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    },
    {
      role: "window",
      submenu: [
        {
          label: "New Window",
          accelerator: "CmdOrCtrl+n",
          click: () => createWindow()
        },
        { role: "minimize" },
        { role: "close" },
        { role: "quit" }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

function preferencesMenu() {
  // storage.get("preferences", function(error, data) {
  //   bgColor = data.color;
  // });

  let preferences = new BrowserWindow({ width: 300, height: 300 });
  preferences.loadFile("src/preferences.html");

  preferences.on("closed", () => {
    preferences = null;
  });
}

// Creates a new window once Electron is ready.
app.on("ready", createWindow);

// MacOS: Quits when all windows closed
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// MacOS: Creates new window upon clicking the dock icon w/ no windows open.
app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
