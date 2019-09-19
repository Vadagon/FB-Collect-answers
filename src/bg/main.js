console.log('background script started')

var data = {
  groups: {}
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == 'open')
    chrome.tabs.create({ url: "pages/data.html" });

  if (request.type == 'push') {
    data.groups[request.value.groupName] = request.value;
    update();
    if (data.groups[request.value.groupName].docId) {
      sh.addToExisting(request.value.docId, request.value, (docId) => {
        sendResponse(docId)
      })
    } else {
      sh.createNew(request.value, (docId) => {
        data.groups[request.value.groupName].docId = docId;
        sendResponse(docId)
        update();
      })
    }
  }

  if (request.type == 'get')
    chrome.storage.sync.get(['data'], function(result) {
      sendResponse(result.data)
    });

  if (request.type == 'update')
    update(request.value)

  return true;
});
// 708115076090-m4e0iap111lk85l489e8qnls5f7hb014.apps.googleusercontent.com
// cIPkA3NKvsFqxM0LtgwkZvFl
// AIzaSyAAqqg5wA-XeePyvfl2Id8cI6xZ3DED9TA
var params1 = {
  "majorDimension": "ROWS",
  "values": [
    ["Hello1", "World1", "123123"],
    ["Hello1", "World1", "123123"]
  ],
}

var params2 = {
  properties: {
    title: 'About lena #3'
  },
  sheets: [{
    data: [{
      "startRow": 0,
      "startColumn": 0,
      "rowData": [{
        "values": [{
            userEnteredValue: {
              "stringValue": 'lena the best!!!'
            }
          },
          {
            userEnteredValue: {
              "stringValue": 'lena the best!!!'
            }
          },
          {
            userEnteredValue: {
              "stringValue": 'lena the best!!!'
            }
          }
        ]
      }]
    }]
  }]
}
var sh = {
  token: !1,
  genToken: function(cb) {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      this.token = token;
      cb(token)
    })
  },
  tool: {
    genAddTo: function(data) {
      var newData = {
        majorDimension: "ROWS",
        values: [
          data.head
        ]
      };
      Object.keys(data.body).forEach(function(bodyKey) {
        var record = []
        data.head.forEach(function(key) {
          data.body[bodyKey][key] ? record.push(data.body[bodyKey][key].toString()) : record.push('?')
        })
        newData.values.push(record)
      })
      return newData;
    },
    genNew: function(data) {
      var newData = {
        properties: {
          title: data.groupName
        },
        sheets: [{
          data: [{
            startRow: 0,
            startColumn: 0,
            rowData: [{
              values: []
            }]
          }]
        }]
      }
      data.head.forEach(function(el){
        newData.sheets[0].data[0].rowData[0].values.push({userEnteredValue: {
          stringValue: el.toString()
        }})
      })
      Object.keys(data.body).forEach(function(bodyKey, index) {
        var record = []
        data.head.forEach(function(key) {
          data.body[bodyKey][key] ? record.push(data.body[bodyKey][key]) : record.push('?')
        })
        var newRecord = []
        record.forEach(function(el){
          newRecord.push({
            userEnteredValue: {
              stringValue: el.toString()
            }
          })
        })
        newData.sheets[0].data[0].rowData.push({
          values: newRecord
        })
      })
      return newData;
    }
  },
  addToExisting: function(id, data, cb) {
    this.genToken(() => {
      $.ajax({
        type: "PUT",
        headers: { "Authorization": 'Bearer ' + this.token },
        contentType: 'application/json',
        url: "https://sheets.googleapis.com/v4/spreadsheets/" + id + "/values/Sheet1?valueInputOption=USER_ENTERED",
        dataType: "json",
        data: JSON.stringify(sh.tool.genAddTo(data))
      }).done((msg) => {
        cb(id)
      });
    });
  },
  createNew: function(data, cb) {
    this.genToken(() => {
      $.ajax({
        type: "POST",
        headers: { "Authorization": 'Bearer ' + this.token },
        contentType: 'application/json',
        url: "https://sheets.googleapis.com/v4/spreadsheets",
        dataType: "json",
        data: JSON.stringify(sh.tool.genNew(data))
      }).done((msg) => {
        if (msg) window.sheetId = msg.spreadsheetId
        cb(msg.spreadsheetId);
        // addToExisting(window.sheetId)
      });
    });
  }
}


// sh.addToExisting('1ajWBQdJemPlUK04nNE7OdwQ5F9R-_ZCPXQn_WvPUAqA', params1)
// sh.createNew(params2)




// setting default storage paramenters
chrome.storage.sync.get(["data"], function(items) {
  if (items.data) {
    data = items.data;
  } else {
    update()
  }
});


function update(e) {
  if (e) data = Object.assign(data, e)
  chrome.storage.sync.set({ "data": data });
}
