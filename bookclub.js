var currentBookCounter = 0;

function newRequest(caller) {
    document.getElementById("landingPage").style.display = 'none';
    document.getElementById("afterkeep").style.display = 'block';

	currentBookCounter = 0;

    if (caller == 'landing'){
        var parent = document.getElementById('landingPage');
        var title = parent.querySelector('#title').value;
        var author = parent.querySelector('#author').value;
        var isbn = parent.querySelector('#isbn').value;
    }

    else{
        var parent = document.getElementById('afterkeep');
        var title = parent.querySelector('#title').value;
        var author = parent.querySelector('#author').value;
        var isbn = parent.querySelector('#isbn').value;
    }

	//var title = document.getElementById("title").value;
    title = title.trim();
	title = title.replace(" ","+");

	//var author = document.getElementById("author").value;
	author = author.trim();
	author = author.replace(" ","+");

	//var isbn = document.getElementById("isbn").value;
	isbn = isbn.trim();
	isbn = isbn.replace("-","");

	var fullEmpty = false;
	if( !title && !author && !isbn ){		// if no details provided, do nothing
		fullEmpty = true;
	}

	if ( !fullEmpty ) {

		var query = ["",title,author,isbn].join("+");
		// remove old script
		var oldScript = document.getElementById("jsonpCall");
		if (oldScript != null) {
			document.body.removeChild(oldScript);
		}
		// make a new script element
		var script = document.createElement('script');

		// build up complicated request URL
		var beginning = "https://www.googleapis.com/books/v1/volumes?q="
		//var callback = "&callback=handleResponse"
		var callback = "&callback=newRequest.handleResponseM"

		script.src = beginning+query+callback
		script.id = "jsonpCall";

		// put new script into DOM at bottom of body
		document.body.appendChild(script);

		newRequest.handleResponseM = function(bookListObj) {
					handleResponse(bookListObj, title, author, isbn);
 			}
		}
}


function handleResponse(bookListObj, title, author, isbn) {
	var bookList = bookListObj.items;

	if( bookListObj.totalItems == 0){
		document.getElementById("error").style.display = "block";
		document.getElementById("error-title").textContent = title;
		document.getElementById("error-author").textContent= author;
		document.getElementById("error-isbn").textContent = isbn;
		return;
	}
	/* where to put the data on the Web page */
	var bookDisplay = document.getElementById("bookDisplay");

	/* if not empty then you need to empty out the stuff */
	while (bookDisplay.hasChildNodes()){
		bookDisplay.removeChild(bookDisplay.childNodes[0]);
	}

	/* write each title as a new paragraph */
	for (i=0; i<bookList.length; i++) {
		var book = bookList[i];
		var title = book.volumeInfo.title;
		var author = book.volumeInfo.authors;
		var description = book.volumeInfo.description;
		var thumbNail = book.volumeInfo.imageLinks.thumbnail;

		if( description ){
			description.split(/\s+/).slice(0,30).join(" ")+"...";
		}
		else{
			description = "";
		}

		if( !author ){
			author = "";
		}
		else {
			author = author.join(", ");
		}

		var bookContain = document.createElement("div");	// create the book container
		var bookDetails = document.createElement("div");	// create the details container
		//bookContain.onclick = on;

		var image = document.createElement("img");			// set the thumbnail
		image.classList.add("nondisplay-img");
		var titlePgh = document.createElement("p");			// set the title
		titlePgh.classList.add("nondisplay-title");
		var authorPgh = document.createElement("p");		// set the author
		authorPgh.classList.add("nondisplay-author");
		var descriptPgh = document.createElement("p");	// set the description
		descriptPgh.classList.add("nondisplay-descript");

		image.src = thumbNail;
		titlePgh.textContent = title;
		authorPgh.textContent = author;
    descriptPgh.textContent = description;

		bookDetails.append(titlePgh);				// add title to details container
		bookDetails.append(authorPgh);			// add author to details container
		bookDetails.append(descriptPgh);		// add description to details container

    bookContain.append(image);					// add thumbnail to book container
		bookContain.append(bookDetails);		// add thumbnail to book container

    bookDisplay.append(bookContain);		// throw container to the book display
	}
	initalOn();
}

function off() {
    document.getElementById("bookOverlay").style.display = "none";
		document.getElementById("error").style.display = "none";
}

function keep(){
	var overlayContain = document.getElementById("overlayContain");	// overlay center info div
	var bookDisplay = document.getElementById("actualDisplay");


	var bookContain = document.createElement("div");	// create the book container
	bookContain.classList.add("outerCard");
	var bookInner = document.createElement("div");
	bookInner.classList.add("innerCard");
	var bookDetails = document.createElement("div");	// create the details container
	bookDetails.classList.add("book-details");

	var image = document.createElement("img");			// set the thumbnail
	var titlePgh = document.createElement("p");			// set the title
	var authorPgh = document.createElement("p");		// set the author
	var descriptPgh = document.createElement("p");	// set the description


	image.src = document.getElementById("overlay-book-pic").src;
	titlePgh.textContent = document.getElementById("overlay-book-title").textContent;
	titlePgh.classList.add("book-title");
	authorPgh.textContent = document.getElementById("overlay-book-author").textContent;
	authorPgh.classList.add("book-author");
	descriptPgh.textContent = document.getElementById("overlay-description").textContent;
	descriptPgh.classList.add("description");

    var button = document.createElement("button");
	button.onclick= remove;
	button.textContent="X";
	button.classList.add("removeButton");

	bookDetails.append(titlePgh);				// add title to details container
	bookDetails.append(authorPgh);			// add author to details container
	bookDetails.append(descriptPgh);		// add description to details container

	bookInner.append(image);					// add thumbnail to book container
	bookInner.append(bookDetails);		// add thumbnail to book container

	bookContain.append(button);
	bookContain.append(bookInner);
	bookDisplay.append(bookContain);		// throw container to the book display
}


function remove(){
	this.parentNode.parentNode.removeChild(this.parentNode); 	// delete it
}

function initalOn() {
		setOverlay("none");
}

function left(){
	setOverlay("left");
}

function right(){
	setOverlay("right");
}

function setOverlay(movement){
	var bookDisplay = document.getElementById("bookDisplay");
	if(movement == "left" && currentBookCounter>0){
		currentBookCounter--;		// move left
	}
	else if(movement == "right" && currentBookCounter < bookDisplay.childNodes.length){
		currentBookCounter++;		// move right
	}

	document.getElementById("bookOverlay").style.display = "block";
	document.getElementById("overlay-book-pic").src = bookDisplay.childNodes[currentBookCounter].childNodes[0].src;
	document.getElementById("overlay-book-title").textContent = bookDisplay.childNodes[currentBookCounter].childNodes[1].childNodes[0].textContent;
	document.getElementById("overlay-book-author").textContent = bookDisplay.childNodes[currentBookCounter].childNodes[1].childNodes[1].textContent;
	document.getElementById("overlay-description").textContent = bookDisplay.childNodes[currentBookCounter].childNodes[1].childNodes[2].textContent;
}
