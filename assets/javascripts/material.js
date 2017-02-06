window.addEventListener("load", materialInit, false);

function materialInit(){
	// Set all menu triggers
	initMenus();
}

function initMenus(){
	var menus = document.querySelectorAll(".menu");

	for(i = 0; menus.length > i; i++){
		var menu = menus.item(i),
			trigger = menu.querySelector(".menu-trigger"),
			list = menu.querySelector(".menu-list");

		// Toggle menu list when trigger is clicked
		trigger.addEventListener("click", function(){
			list.classList.toggle("hidden");
		});

		list.addEventListener("click", function(){
			this.classList.add("hidden");
		});
	}
}