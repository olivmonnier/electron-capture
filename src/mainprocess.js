import settingsDefault from './settingsDefault';
import { ipcMain, remote } from 'electron';
const Store = require('electron-store');
const express = require('express')
const store = new Store({ defaults: settingsDefault });

module.exports = function() {
  const app = express();
  const { port } = store.get('server');

  app.get('/', function(req, res) {
    res.send('Hello World')
  });

  app.get('/sources', function() {

  })

  app.listen(port, function() {
    console.log(`Server run on port ${port}`)
  });
}