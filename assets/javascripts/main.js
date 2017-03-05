window.onload = init;
window.$currentNav = "#section-home";

function init(){
	navigate(location.hash || window.$currentNav, true); //Display the home section

	// Set local messages
	setLocal();
	setApiData();
	setNavigation();
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
					msg = getData("msg", node);

				node.textContent = messages[msg];
			}
		});
}

function setApiData(){
	var props = document.querySelectorAll("*[data-prop]");

	fetch("https://api.github.com/users/Nosthertus")
		.then((data) => {
			for(i = 0; props.length > i; i++){
				var node = props.item(i),
					prop = getData("prop", node);

				node.textContent = data[prop];
			}
		});
}

/**
 * Adds event listener to all navigators
 */
function setNavigation(){
	var navigators = document.querySelectorAll("[data-navigate]");

	for(i = 0; navigators.length > i; i++){
		var navigator = navigators.item(i);

		navigator.addEventListener("click", function(){
			var attr = this.attributes.getNamedItem("data-navigate");

			navigate(attr.value);
		});
	}
}

/**
 * Navigates to the target hash with a fading animation
 * 
 * @param  {String}  hash  The hash url string where to transition
 * @param  {Boolean} force Whether should force the navigation to the hash without hiding the old section
 */
function navigate(hash, force = false){
	var section = document.querySelector(hash);
	var oldSection = document.querySelector(window.$currentNav);

	if(hash != window.$currentNav && force == false){
		oldSection.classList.add("hidden");

		oldSection.ontransitionend = function(){
			window.location.hash = hash;
			window.$currentNav = hash;
			oldSection.ontransitionend = null;

			section.classList.remove("hidden");
		};
	}

	else if(force == true){
		window.$currentNav = hash;

		section.classList.remove("hidden");
	}
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
	if(getCookie("locale")){
		return getCookie("locale");
	}

	else{
		var locale = navigator.languages && navigator.languages[0] ||	// Chrome / Firefox
			navigator.language || navigator.userLanguage;		// All browsers

		return locale.length > 2 ? locale.slice(0, 2) : locale;
	}
}

/**
 * Gets the data value from the provided data name attribute
 * 
 * @param  {String} data The name of the data attribute which will extract the value
 * @param  {Node}   node The node element from HTML
 * @return {String}      The message box value in the element
 */
function getData(data, node){
	return node.attributes.getNamedItem(`data-${data}`).nodeValue;
}

function setLang(local){
	setCookie("locale", local);

	location.reload();
}

function setCookie(key, value){
	var date = new Date();

	date.setDate(date.getDate() + 7);

	var cookie = `${key}=${value}; ${date.toUTCString()};`;
	
	document.cookie = cookie;
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}