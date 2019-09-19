chrome.extension.sendMessage({type: 'get'}, function(res){
	console.log(res)
})