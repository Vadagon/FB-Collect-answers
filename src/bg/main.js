console.log('background script started')

var data = {
  paid: false,
  groups: {}
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == 'open')
    chrome.tabs.create({ url: "pages/data.html" });

  if (request.type == 'push') {
    data.groups[request.value.groupName] = request.value;
    update();
    // if (data.groups[request.value.groupName].docId) {
    //   // console.log(sh.tool.genAddTo(request.value))
    //   sh.addToExisting(request.value.docId, JSON.parse(JSON.stringify(request.value)), (docId) => {
    //     sendResponse(docId)
    //   })
    // } else {
    //   // console.log(sh.tool.genNew(request.value))
    //   sh.createNew(JSON.parse(JSON.stringify(request.value)), (docId) => {
    //     data.groups[request.value.groupName].docId = docId;
    //     sendResponse(docId)
    //     update();
    //   })
    // }
  }
  if (request.type == 'unlink') {
    data.groups[request.value.groupName] = request.value;
    update();
    sendResponse(false)
  }

  if (request.type == 'get')
    sendResponse(data)
    // chrome.storage.local.get(['data'], function(result) {
    // });
  if(request.email){
    checkPayment(request.email, (e)=>{
      sendResponse(e)
      if(e) data.paid = true;
    })
  }
  if (request.type == 'update')
    update(request.value)

  return true;
});
// var params1 = {
//   "majorDimension": "ROWS",
//   "values": [
//     ["Hello1", "World1", "123123"],
//     ["Hello1", "World1", "123123"]
//   ],
// }

// var params2 = {
//   properties: {
//     title: 'About lena #3'
//   },
//   sheets: [{
//     data: [{
//       "startRow": 0,
//       "startColumn": 0,
//       "rowData": [{
//         "values": [{
//             userEnteredValue: {
//               "stringValue": 'lena the best!!!'
//             }
//           },
//           {
//             userEnteredValue: {
//               "stringValue": 'lena the best!!!'
//             }
//           },
//           {
//             userEnteredValue: {
//               "stringValue": 'lena the best!!!'
//             }
//           }
//         ]
//       }]
//     }]
//   }]
// }
var sh = {
  token: !1,
  accountSample: {},
  genToken: function(cb) {
    chrome.identity.getAuthToken(Object.assign({}, this.accountSample), (token)=>{
      if(chrome.runtime.lastError){
        console.log('needed interactive; ', chrome.runtime.lastError.message)
        chrome.identity.getAuthToken(Object.assign({interactive: true}, this.accountSample), (token) => {
          this.token = token;
          cb(token)
        });
      }else{
        this.token = token;
        cb(token)
        console.log('got without interactive')
      }
    })
  },
  tool: {
    genAddTo: function(data) {
      data.head = data.head.map((el)=>{
        if(el == 'id') el = 'Date';
        return el;
      })
      var newData = {
        majorDimension: "ROWS",
        values: [
          data.head
        ]
      };
      Object.keys(data.body).forEach(function(bodyKey) {
        var record = []
        data.head.forEach(function(key) {
          var value = data.body[bodyKey][key];
          if(key=='Date') value = formatDate(data.body[bodyKey]['id'])
          value ? record.push(value.toString()) : record.push('')
        })
        newData.values.push(record)
      })
      return newData;
    },
    genNew: function(data) {
      data.head = data.head.map((el)=>{
        if(el == 'id') el = 'Date';
        return el;
      })
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
          var value = data.body[bodyKey][key];
          if(key=='Date') value = formatDate(data.body[bodyKey]['id'])
          value ? record.push(value.toString()) : record.push('')
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
        console.log(msg)
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
        console.log(msg)
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
chrome.storage.local.get(["data"], function(items) {
  if (items.data) {
    data = items.data;
    data.paid = false;
  } else {
    update()
  }
});

// chrome.identity.getProfileUserInfo(function(e){
//   sh.user = e
//   if(e && e.id)
//     sh.accountSample = {account: {id: sh.user.id}};
// })

function update(e) {
  if (e) data = Object.assign(data, e)
  chrome.storage.local.set({ "data": data });
}

function checkPayment(email, cb){
  $.get('https://us-central1-margarita-1.cloudfunctions.net/DBinsert/isMember?email='+email).done((e)=>{
    cb(e && e.result)
  }).fail(()=>{
    cb(false)
  })
}








function formatDate(id) {
  var date = new Date(id*1000)

  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + '.' + monthIndex + '.' + year;
}



chrome.browserAction.onClicked.addListener(function (e) {
  chrome.tabs.create({url: chrome.extension.getURL('/pages/data.html')});
});

