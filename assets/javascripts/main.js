window.onload = init;

function init(){
	// Set local messages
	setLocal();
}

/**
 * Sets all the local messages in the DOM
 */
function setLocal(){
	var msgs = document.querySelectorAll("*[data-msg]");

	// get Local data from JSON file
	fetch("locales.json")
		.then((data) => {
			var local = getLanguage(),
				messages = data[local];

			// Set all messages to all elements
			for(i = 0; msgs.length > i; i++){
				var node = msgs.item(i),
					msg = getDataMsg(node);

				node.textContent = messages[msg];
			}
		});
}

/**
 * Executes AJAX call to the desired url
 * 
 * @param  {String} url The url of the request
 * @return {Promise}    The promise of the result on AJAX call
 */
function fetch(url){
	return new Promise((resolve, request) => {
		var http = new XMLHttpRequest();

		http.responseType = "json";

		http.open("GET", url);

		// Send the request to the url
		http.send();

		http.onload = () => {
			resolve(http.response);
		};

		http.onerror = () => {
			reject({
				message: "An error ocurred during the request"
			});
		}
	});
}

/**
 * Gets the language on the browser
 * 
 * @return {String} The local language of the browser
 *
 * @todo get the local language selected from cookie storage
 */
function getLanguage(){
	var locale = navigator.languages && navigator.languages[0] ||	// Chrome / Firefox
		navigator.language || navigator.userLanguage;		// All browsers

		return locale.length > 2 ? locale.slice(0, 2) : locale;
}

/**
 * Gets the msg data stored in the provided node
 * 
 * @param  {Node}   node The node element from HTML
 * @return {String}      The message box value in the element
 */
function getDataMsg(node){
	return node.attributes.getNamedItem("data-msg").nodeValue;
}