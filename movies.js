function initialize() {

	this.movies = new Object();
	this.update1 = false;
	this.update2 = false;
}

function sendRequest() {
	var xhr = new XMLHttpRequest();
	var query = encodeURI(document.getElementById("form-input").value);
	xhr.open("GET", "proxy.php?method=/3/search/movie&query=" + query);
	xhr.setRequestHeader("Accept", "application/json");
	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			var json = JSON.parse(this.responseText);
			var str = JSON.stringify(json, undefined, 2);
			var obj = eval("(" + str + ")");
			createTable(obj);
		}
	};
	xhr.send(null);
}

function sendRequest2(id) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "proxy.php?method=/3/movie/" + id);
	xhr.setRequestHeader("Accept", "application/json");
	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			var json = JSON.parse(this.responseText);
			var str = JSON.stringify(json, undefined, 2);
			var obj = eval("(" + str + ")");

			updateObject2(obj);
			createTable2();
		}
	};
	xhr.send(null);
}

function sendRequest3(id) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "proxy.php?method=/3/movie/" + id + "/credits");
	xhr.setRequestHeader("Accept", "application/json");
	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			var json = JSON.parse(this.responseText);
			var str = JSON.stringify(json, undefined, 2);
			var obj = eval("(" + str + ")");

			updateObject3(obj);
			createTable2();
		}
	};
	xhr.send(null);
}
function updateObject2(obj) {
	this.movies.original_title = obj.original_title;
	this.movies.overview = obj.overview;
	this.movies.poster_path = obj.poster_path;
	this.movies.genres = (obj.genres).length;
	this.movies.genrestype = '';
	for (var i = 0; i < this.movies.genres; i++) {
		this.movies.genrestype = this.movies.genrestype + ','
				+ obj.genres[i].name;
	}
	this.update1 = true;
}
function updateObject3(obj) {
	this.cast = new Array();
	this.movies.cast = (obj.cast).length;
	//this.movies.casttype='';
	if (this.movies.cast >= 5)
		this.movies.cast = 5;

	for (var i = 0; i < this.movies.cast; i++) {
		this.cast.push(obj.cast[i].name);
	}
	this.update2 = true;
}

function createTable(obj) {
	var iTotalResults = (obj.total_results);

	deleteRows("output");
	deleteRows("detailInfo");
	document.getElementById("detailInfo").removeAttribute("style");
	setAtrributes("output");
	document.getElementById("body").innerHTML = '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h2>Movie search results..</h2>';
	document.getElementById("body").style.display = "block";
	document.getElementById("output").style.width = '35%';
	document.getElementById("output").style.styleFloat = 'left';
	var innerStrHTML = '';
	var strHTML = '';
	//No such results found
	for (var i = 0; i < iTotalResults; i++) {
		if (obj.results[i].release_date != null
				&& obj.results[i].release_date != "") {
			this.splitReleaseYear = obj.results[i].release_date.split("-");
		} else {
			this.splitReleaseYear[0] = '';
		}

		innerStrHTML += '<li><a onclick="sendRequest2(' + obj.results[i].id
				+ ');sendRequest3(' + obj.results[i].id
				+ ')" href="#" style="text-decoration:none;">'
				+ obj.results[i].title + '&nbsp;&nbsp;('
				+ this.splitReleaseYear[0] + ')</a></li><br>';

	}
	if (iTotalResults > 0) {
		strHTML = '<br><ul>' + innerStrHTML + ' </ul></div>';
	} else {
		strHTML = '<br><ul><h2>No Results Found</h2></ul></div>';
	}

	document.getElementById("output").innerHTML = strHTML;
	document.getElementById("output").style.display = "block";

}
function createTable2(obj) {

	if (this.update1 && this.update2) {
		deleteRows("detailInfo");
		setAtrributes("detailInfo");
		this.castList = '';
		for (var i = 0; i < this.cast.length; i++) {

			if (this.cast[i] != '')
				this.castList = this.castList + '<li>' + this.cast[i] + '</li>';

		}
		var strCast = '<ul><b>Cast:</b>' + this.castList + '</ul></div>';

		document.getElementById("detailInfo").style.styleFloat = "right";
		document.getElementById("detailInfo").style.cssFloat = "right";
		document.getElementById("detailInfo").style.width = '50%';
		var detailInfo = '<img alt="No image" style="width:30%; height:40%;" src="http://image.tmdb.org/t/p/w185'
				+ this.movies.poster_path
				+ '"><div style="float:right">'
				+ strCast
				+ '</div><ul><li><b>Title</b>: '
				+ this.movies.original_title
				+ '</li><li><b>Genres</b>: '
				+ this.movies.genrestype
				+ '</li><li><b>Overview</b>:'
				+ this.movies.overview + '</li></ul>';
		document.getElementById("detailInfo").innerHTML = detailInfo;
		document.getElementById("detailInfo").style.display = "block";
		this.update1 = false;
		this.update2 = false;
	}
}

function deleteRows(dataTable) {
	document.getElementById(dataTable).innerHTML = "";
}
function setAtrributes(divId) {
	document.getElementById(divId).style.marginTop = '35px';
	document.getElementById(divId).style.border = '1px inset';
	document.getElementById(divId).style.padding = '5px:';
	document.getElementById(divId).style.fontSize = 'smaller:';
	document.getElementById(divId).style.borderRadius = '5px';
	document.getElementById(divId).style.fontSize = 'smaller:';
	document.getElementById(divId).style.display = 'block:';
	document.getElementById(divId).style.position = 'relative';
	document.getElementById(divId).style.backgroundColor = 'rgb(255, 255, 255)';
	document.getElementById(divId).style.fontFamily = 'Palatino Linotype';

}
