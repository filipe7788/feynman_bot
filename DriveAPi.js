const readline = require('readline');
const getfilelist = require("google-drive-getfilelist");
const {google} = require('googleapis');
const fs = require('fs')
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
 
    

getCredentials = (callback) => {
// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), callback)
    });
}    

    
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
  
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
}
    
/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
        });
        return oAuth2Client;
    });
    });
}
    
/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

function listFiles(searchText, callback, errorCalback) {
    let folderId = "1ZJjJYVXuPIpCJ4ISHEBsD5xIkyn0JlUk";
    getCredentials((auth) => {
        const resource = {
            auth,
            id: folderId,
            fields: "files(name,id, mimeType, webViewLink)",
          };
          

        getfilelist.GetFileList(resource, function (err, res) {
            // or getfilelist.GetFolderTree(resource, function(err, res) {
            if (err) {
              console.log(err);
              return;
            }

            var files = []
            res.fileList.forEach(element => {
                let filesFrom = getAlikeFiles(searchText, element.files)
                files.push(...filesFrom)
            });
            callback(files)
          });
    });
}

function getAlikeFiles(searchText, files) {
    var items = []
    files.forEach(file => {
        if(file.name.toLowerCase().includes(searchText.toLowerCase()) && file.mimeType == "application/pdf") {
            items.push(file)
        }
    })
    return items
}

module.exports.listMyFiles = (searchText, callback, errorCalback) => {
    listFiles(searchText, callback, errorCalback)
}