var tunnel = chrome.extension.sendMessage;
var data = {};
tunnel({type: 'get'}, (res)=>{
	console.log(res)
	data = res;
	// tunnel({type: 'update', value: data})
});
$(document).ready(function() {
	tryAdd()
	$('._2iel._5kx5').click(function(){
		chrome.extension.sendMessage({type: 'open'});
	})
});

// AIzaSyAfOwtYjAoQ6pfRNgAvQnxP-bYKNwkLzsk
// {"web":{"client_id":"708115076090-m4e0iap111lk85l489e8qnls5f7hb014.apps.googleusercontent.com","project_id":"quickstart-1568741296164","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"cIPkA3NKvsFqxM0LtgwkZvFl","javascript_origins":["http://localhost:8000"]}}


function tryAdd() {
	var where = '#member_requests_pagelet ._51xa:first'
	var collectAllButton = '<button id="FunnelCollect" class="_4jy0 _4jy3 _517h _51sy _42ft">Collect All</button>'
	var inter = setInterval(function() {
		if(!$(where).length) return;

		var groupName = $('#seo_h1_tag a').text()

		if(!$(where).find('#FunnelCollect').length) $(collectAllButton).prependTo(where).click(parseFeed)
		if(!$(where).find('a#funnelLink').length && groupName && data.groups[groupName] && data.groups[groupName].docId)  $('<a target="_blank" id="funnelLink" href="https://docs.google.com/spreadsheets/d/'+data.groups[groupName].docId+'/" style="margin-right: 10px;"> Google Sheet</a>').prependTo(where)


		// if(!$('#funnelTunnelProccess').length) parseFeed()
		// clearInterval(inter)
	}, 300);
}
var parseInterval;
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
		if(i>10) loadFeed()
	}, 300);
	$(`<div id="funnelTunnelProccess">
		<div>Click to Stop</div>
	   </div>`).prependTo('#member_requests_pagelet').find('div').click(function(){
	   	loadFeed()
	   })
	// loadFeed()
}
function loadFeed(){

	$('#funnelTunnelProccess').remove()
	$("html, body").animate({ scrollTop: 0 }, 1400);
	parseInterval && clearInterval(parseInterval)

	var groupName = $('#seo_h1_tag a').text()
	if(!data.groups[groupName]) data.groups[groupName] = {head: [], body: {}, docId: !1, groupName: groupName}
	var unSortedData = []
	$('#member_requests_pagelet .uiList._4kg._4kt._6-h._6-j > li').each(function(){ try{

		var record = {}
		record.groupName = groupName;
		record.name = $(this).find('._66jq a').text()
		record.userId = $(this).find('._66jq a').attr('href').slice(1)
		record.url = $(this).find('._66jq a')[0].href
		record.id = $(this).find('.livetimestamp').data('utime')
		$(this).find('._4wsr li').each(function(){
			record[$(this).find('div').text()] = $(this).find('text').text();
		})
		Object.keys(record).forEach(function(key){
			if(!data.groups[groupName].head.includes(key)) data.groups[groupName].head.push(key)
		})
		if(!jQuery.isEmptyObject(record) && !data.groups[groupName].body[record.id]) data.groups[groupName].body[record.id] = record;
	}catch(err){console.log(err);} })

	tunnel({type: 'push', value: data.groups[groupName]}, function(docId){
		data.groups[groupName].docId = docId;
	});
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