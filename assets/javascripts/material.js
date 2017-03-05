window.addEventListener("load", materialInit, false);

function materialInit(){
	// Set all menu triggers
	initMenus();
	initSubMenus();
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

function initSubMenus(){
	var menuTriggers = document.querySelectorAll(".sub-menu-trigger");

	for(i = 0; menuTriggers.length > i; i++){
		var menuTrigger = menuTriggers.item(i);

		menuTrigger.addEventListener("click", function(){
			var attr = this.attributes.getNamedItem("data-menu-target");

			// Toggle hidden class to the target element
			if(attr){
				var target = document.getElementById(attr.value);

				target.classList.toggle("hidden");
			}

			// No target was set in the element
			else{
				console.error("no menu target on node:", this);
			}
		});
	}
}