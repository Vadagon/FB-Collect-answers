var tunnel = chrome.extension.sendMessage;
var oldPath = {
	pathName: 'old',
	groupName: '#seo_h1_tag a',
	button: '#member_requests_pagelet ._51xa:first > button:first',
	collectAllButton: '<button id="FunnelCollect" class="_4jy0 _4jy3 _517h _51sy _42ft">Collect All</button>',
	unlinkButton: '<button id="FunnelUnlinkButton" class="_4jy0 _4jy3 _517h _51sy _42ft">X</button>',
	requests: '#member_requests_pagelet .uiList._4kg._4kt._6-h._6-j > li',
	name: '._66jq a',
	requestDate: '.livetimestamp',
	records: {
		question: '._4wsr ._50f8',
		answer: '._4wsr ._50f8 + *'
	}
}
var newPath = {
	pathName: 'new',
	groupName: 'body > div > div > div > div > div > div > div > div > div > div > div > div > div > div > a > div > div > div > div > div > div > span > div > span',
	button: 'body > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div:nth-child(1) > div[role=button]',
	collectAllButton: '<button id="FunnelCollect" class="newDesign oajrlxb2 s1i5eluu gcieejh5 bn081pho humdl8nn izx4hr6d rq0escxv nhd2j8a9 j83agx80 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys tkv8g59h qt6c0cv9 fl8dtwsd i1ao9s8h esuyzwwr f1sip0of lzcic4wl l9j0dhe7 abiwlrkh p8dawk7l beltcj47 p86d2i9g aot14ch1 kzx2olss cbu4d94t taijpn5t ni8dbmo4 stjgntxs k4urcfbm tv7at329">Collect All</button>',
	dataLink: '<span id="FunnelLink" style="margin-right: 10px;"> Collected Data</span>',
	unlinkButton: '<button id="FunnelUnlinkButton" class="_4jy0 _4jy3 _517h _51sy _42ft">X</button>',
	requests: 'body > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div[class=""]',
	name: 'div:nth-child(1) span > div > a',
	requestDate: 'div:nth-child(1) > div > div > div > div > span',
	records: {
		question: 'div:nth-child(2) div > ul > li span',
		answer: 'div:nth-child(2) div > ul > li div > span'
	}
}
var path = oldPath;

var data = {};
tunnel({type: 'get'}, (res)=>{
	console.log(res)
	data = res;
	// tunnel({type: 'update', value: data})
});
$(document).ready(function() {
	tryAdd()
	// $('._2iel._5kx5').click(function(){
	// 	chrome.extension.sendMessage({type: 'open'});
	// })
});
// $('body > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div[class=""]').find('div:nth-child(1) > div > div > div > div > span').eq(0).text()
// AIzaSyAfOwtYjAoQ6pfRNgAvQnxP-bYKNwkLzsk
// {"web":{"client_id":"708115076090-m4e0iap111lk85l489e8qnls5f7hb014.apps.googleusercontent.com","project_id":"quickstart-1568741296164","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"cIPkA3NKvsFqxM0LtgwkZvFl","javascript_origins":["http://localhost:8000"]}}

// document.querySelectorAll("body > div > div > div > div > div > div > div > div > div > div > div > div > div > div > a > div > div > div > div > div > div > span > div > span")

// $('body > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div[class=""]').eq(0).find('div:nth-child(1) > div > div > div > div > span').eq(0).text().replace('Requested ', '')

function tryAdd() {
	var inter = setInterval(function() {
		if($(oldPath.button).length) path = oldPath;
		else path = newPath;


		if(!$(path.button).length) return;

		var groupName = $(path.groupName).text()
		if(groupName && !$('#FunnelCollect').length) $(path.collectAllButton).insertBefore(path.button).click(parseFeed)
		// if(groupName && !$('#FunnelCollect').length) $(path.collectAllButton).insertBefore(path.button).click(loadFeed)
		// if(!$(path.buttons).find('#FunnelUnlinkButton').length && groupName && data.groups[groupName] && data.groups[groupName].docId) $(unlinkButton).prependTo(path.buttons).click(unlinkFeed)
		// if(groupName && !$('#FunnelLink').length && data.groups[groupName])  $(path.dataLink).insertBefore(path.button).click(()=>{
		// 	chrome.extension.sendMessage({type: 'open'});
		// })


		// if(!$('#funnelTunnelProccess').length) parseFeed()
		// clearInterval(inter)
	}, 1400);
}
var parseInterval;
function unlinkFeed(){
	if(!confirm("Do really you want to unlink google spreadsheet from the group?")) return;
	var groupName = $(path.groupName).text()
	data.groups[groupName].docId = false;
	tunnel({type: 'unlink', value: data.groups[groupName]}, function(docId){
		data.groups[groupName].docId = docId;
		$('#FunnelLink, #FunnelUnlinkButton').remove()
	});
}
function parseFeed(){
	var i = 0;
	var hhh = $(document).height();
	parseInterval = setInterval(function() {
		i++;
		$("html, body").animate({ scrollTop: $(document).height() }, 300);
		if(hhh !== $(document).height()) {
			hhh = $(document).height()
			i = 0;
		}
		if(i>15) loadFeed()
	}, 300);
	$(`<div id="funnelTunnelProccess">
		<div>Click to Stop</div>
	   </div>`).prependTo('body').find('div').click(function(){
	   	loadFeed()
	   })
	// loadFeed()
}
function loadFeed(){

	$('#funnelTunnelProccess').remove()
	$("html, body").animate({ scrollTop: 0 }, 1400);
	parseInterval && clearInterval(parseInterval)

	var groupName = $(path.groupName).text()
	if(!data.groups[groupName]) data.groups[groupName] = {head: [], body: [], groupName: groupName}
	var unSortedData = []
	$(path.requests).each(function(index){ try{

		var record = {}
		record.groupName = groupName;
		record.name = $(this).find(path.name).text()
		record.userId = $(this).find(path.name).attr('href').slice(1).replace('ttps://www.facebook.com/', '')
		record.url = $(this).find(path.name)[0].href
		record.requestDate = $(this).find(path.requestDate).data('utime')
		if(!record.requestDate) record.requestDate = $(this).find(path.requestDate).eq(0).text().replace('Requested ', '')
		record.parseDate = new Date().getTime() + index*1000;
		
		var that = this;
		$(this).find(path.records.question).each(function(id){
			record[$(this).text()] = $(that).find(path.records.answer).eq(id).text();
			if(path.pathName == 'old' && !$(this).parent().find('text').length){
				record[$(this).text()] = $(this).parent().clone().children().remove().end().text();
			}
		})
		console.log(record)
		// console.log(record)
		Object.keys(record).forEach(function(key){
			if(!data.groups[groupName].head.includes(key)) data.groups[groupName].head.push(key)
		})
		if(!jQuery.isEmptyObject(record) && !data.groups[groupName].body.filter(e=>(e.requestDate==record.requestDate&&e.userId==record.userId)).length) data.groups[groupName].body.push(record);
	}catch(err){console.log(err);} })

	tunnel({type: 'push', value: data.groups[groupName]});
	console.log(data)
}




// millisecondsToStr(new Date().getTime() - record.id*1000)
function millisecondsToStr( milliseconds ) {
    let temp = milliseconds / 1000;
    const years = Math.floor( temp / 31536000 ),
          days = Math.floor( ( temp %= 31536000 ) / 86400 ),
          hours = Math.floor( ( temp %= 86400 ) / 3600 ),
          minutes = Math.floor( ( temp %= 3600 ) / 60 ),
          seconds = temp % 60;

    if ( days || hours || seconds || minutes ) {
      return ( years ? years + "y " : "" ) +
      ( days ? days + "d " : "" ) +
      ( hours ? hours + "h " : ""  ) +
      ( minutes ? minutes + "m " : "" ) +
      Number.parseFloat( seconds ).toFixed( 2 ) + "s";
    }

    return "< 1s";
}
// // set data to local storage
// chrome.storage.sync.set({ key: value }, function() {
//   console.log('Value is set to ' + value);
// });



var s = document.createElement('script');
s.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
// s.onload = function() {
//     this.remove();
// };
(document.head || document.documentElement).appendChild(s);








