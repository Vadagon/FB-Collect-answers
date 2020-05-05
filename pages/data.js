var a = {
	payRequest: false,
	paid: false
}
chrome.extension.sendMessage({type: 'get'}, function(res){
	console.log(res)
	a.paid = res.paid;
	var g = 0;
	for(var group in res.groups){
		$('#noDataTitle').remove()
		$(`
			<div>
				<h2>${group}
				&ensp;
				<button class="button download xlsx">\u21E9 Download Data as XLSX</button>
				<button class="button download csv">\u21E9 Download Data as CSV</button>
				</h2>
				<div id="table${g}"></div>
			</div>
		`).appendTo('body')

		var group = res.groups[group];

		group.body.forEach((e)=>{
			e.requestDate = formatDate(e.requestDate)
			e.parseDate = formatDate(e.parseDate)
		})

		var additionalColumns = group.head.map((e)=>{
			if(/(groupName|name|userId|url|requestDate|parseDate)/ig.test(e)) return false;
			return {title:e, field:e};
		}).filter(e=>e)

		init('#table'+g, group.body, additionalColumns)

		g++;

		if(group.body.length > 50 && !a.paid) a.payRequest = true;
	}
	updateUI()
})


var init = function(id, data, columns){
	var table = new Tabulator(id, {
		data:data,           //load row data from array
		layout:"fitColumns",      //fit columns to width of table
		responsiveLayout:"hide",  //hide columns that dont fit on the table
		tooltips:true,            //show tool tips on cells
		addRowPos:"top",          //when adding a new row, add it to the top of the table
		// history:true,             //allow undo and redo actions on the table
		pagination:"local",       //paginate the data
		paginationSize:10,         //allow 7 rows per page of data
		movableColumns:true,      //allow column order to be changed
		resizableRows:true,       //allow row order to be changed
		initialSort:[             //set the initial sort order of the data
			{column:"name", dir:"asc"},
		],
		columns:[                 //define the table columns
			{title:"Name", field:"name"},
			{title:"Facebook Profile Link", field:"url", formatter:"link", formatterParams: {
			    labelField:"name",
			    target:"_blank"
			}},
			// {title:"Gender", field:"gender", width:95, editor:"select", editorParams:{values:["male", "female"]}},
			// {title:"Rating", field:"rating", formatter:"star", hozAlign:"center", width:100, editor:true},
			// {title:"Color", field:"col", width:130, editor:"input"},
			// {title:"Date Of Request", field:"requestDate", width:150, sorter:"date", hozAlign:"center"},
			{title:"Capture Date", field:"parseDate", width:150, sorter:"date", hozAlign:"center", formatter:"datetime", sorter:"datetime", sorterParams:{
			    format:"YYYY-MM-DD hh:mm:ss",
			    alignEmptyValues:"top",
			}},
			...columns,
			// {title:"Driver", field:"car", width:90,  hozAlign:"center", formatter:"tickCross", sorter:"boolean", editor:true},
			{formatter:"buttonCross", width:40, align:"center", cellClick: (e, cell)=>{cell.getRow().delete()}}
		],
	});
	console.log($(id).parent().find('.download.csv'))
	$(id).parent().find('.download.csv').on('click', ()=>{
		table.download("csv", data[0].groupName+".csv")
	})
	$(id).parent().find('.download.xlsx').on('click', ()=>{
		table.download("xlsx", data[0].groupName+".xlsx")
	})
}



$('#payRequest button').on('click', function(){
	$('#payRequest button').text('◌')
	chrome.extension.sendMessage({email: $('#payRequest input').val()}, (e)=>{
		if(e) a = {payRequest: false, paid: true};
		updateUI()
	})
})









function updateUI(){
	console.log(a)
	if(!a.payRequest || a.paid) $('#payRequest').hide()
	else $('#payRequest').show();
	
	$('#payRequest button').text('OK')
}

function humanizeDate(e){
	return moment(parseInt(e)*1000).fromNow();
}

function formatDate(id) {
  if(!moment(id)._isValid) return id;
  return moment(id).format("YYYY-MM-DD hh:mm:ss")


  var date = new Date(id*1000)

  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate()+1;
  var monthIndex = date.getMonth()+1;
  var year = date.getFullYear();

  return year + '-' + ("0"+monthIndex).slice(-2) + '-' + ("0"+day).slice(-2);
}







