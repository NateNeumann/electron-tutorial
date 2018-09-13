const storage = require("electron-json-storage");
const os = require("os");

storage.setDataPath(os.tmpdir());

document
  .getElementById("save-button")
  .addEventListener("click", function(event) {
    let newColor = document.getElementById("color-input").nodeValue;
    storage.set("preferences", { color: newColor }, function(error) {
      if (error) throw error;
    });
  });
