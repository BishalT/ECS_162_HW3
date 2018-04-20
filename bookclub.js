function newRequest() {

	var title = document.getElementById("title").value;
	title = title.trim();
	title = title.replace(" ","+");

	var author = document.getElementById("author").value;
	author = author.trim();
	author = author.replace(" ","+");

	var isbn = document.getElementById("isbn").value;
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
		var callback = "&callback=handleResponse"

		script.src = beginning+query+callback
		script.id = "jsonpCall";

		// put new script into DOM at bottom of body
		document.body.appendChild(script);
		}

}


function handleResponse(bookListObj) {
	var bookList = bookListObj.items;

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
		bookContain.classList.add("card");
		var bookDetails = document.createElement("div");	// create the details container
		bookDetails.classList.add("book-details");
		bookContain.onclick = on;

		var image = document.createElement("img");			// set the thumbnail
		var titlePgh = document.createElement("p");			// set the title
		var authorPgh = document.createElement("p");		// set the author
		var descriptPgh = document.createElement("p");	// set the description

		image.src = thumbNail;
		titlePgh.textContent = title;
		titlePgh.classList.add("book-title");
		authorPgh.textContent = author;
		authorPgh.classList.add("book-author");
    descriptPgh.textContent = description;
		descriptPgh.classList.add("description");

		bookDetails.append(titlePgh);				// add title to details container
		bookDetails.append(authorPgh);			// add author to details container
		bookDetails.append(descriptPgh);		// add description to details container

    bookContain.append(image);					// add thumbnail to book container
		bookContain.append(bookDetails);		// add thumbnail to book container

    bookDisplay.append(bookContain);		// throw container to the book display
	}
}


function on() {
    document.getElementById("bookOverlay").style.display = "block";
    document.getElementById("overlay-book-pic").src = this.childNodes[0].src;
    document.getElementById("overlay-book-title").textContent = this.childNodes[1].childNodes[0].textContent;
    document.getElementById("overlay-book-author").textContent = this.childNodes[1].childNodes[1].textContent;
    document.getElementById("overlay-description").textContent = this.childNodes[1].childNodes[2].textContent;
}

function off() {
    document.getElementById("bookOverlay").style.display = "none";
}
