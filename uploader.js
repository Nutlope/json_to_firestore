var admin = require("firebase-admin");
var serviceAccount = require("./service_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();
const path = require("path");
const fs = require("fs");
const directoryPath = path.join(__dirname, "files");

fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  files.forEach(function (file) {
    console.log("File is, ", file);
    var lastDotIndex = file.lastIndexOf(".");
    var menu = require("./files/" + file);

    menu.forEach(function (obj) {
      console.log(obj.id);
      console.log(file.substring(0, lastDotIndex));
      firestore
        .collection(file.substring(0, lastDotIndex))
        .doc(obj.id)
        .set(obj)
        .then(function (docRef) {
          console.log("Document written");
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    });
  });
});
