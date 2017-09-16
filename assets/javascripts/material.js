window.addEventListener("load", materialInit, false);

function materialInit(){
	// Set all menu triggers
	initMenus();
	initSubMenus();
	initTabs();
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

/**
 * Initializes the tabs component in order to execute the correct transition and animation.
 * All tabs must follow the guideline from material.io/guidelines/component/tabs
 *
 * @todo Improve how the indicator should be selected within the whole function
 */
function initTabs(){
	var tabs = document.querySelectorAll(".tabs");

	// Set the resize event to all tabs if there's any tab component in the document
	if(tabs.length > 0){
		window.addEventListener("resize", () => {
			resizeIndicators();
		});
	}

	for(i = 0; tabs.length > i; i++){
		var tab             = tabs.item(i),
			tabSelects      = tab.querySelectorAll(".tab-select-item"),
			tabIndicator    = tab.querySelector(".tabs-indicator"),
			tabContentWidth = tab.querySelector(".tabs-content").clientWidth;

		// Give the first tab the class active as it will always be the first selected tab
		tabSelects.item(0).classList.add("active");

		// Check if there is a tab indicator in the tabs component
		// Indicators can be optional
		if(tabIndicator){
			tabIndicator.style.width = tabSelects.item(0).clientWidth + "px";
		}

		for(t = 0; tabSelects.length > t; t++){
			var tabSelect = tabSelects.item(t);

			// Isolate the element iterated to avoid select duplication
			(() => {
				var item = t;

				tabSelect.addEventListener("click", (evt) => {
					selectTab(tab, item);
				});	
			})();
		}
	}

	/**
	 * Selects the tab item calculated from a multiplier index
	 * 
	 * @param  {Element} component  The selected tab component to execute the transition
	 * @param  {Number}  multiplier The multiplier index of the tab clicked
	 */
	function selectTab(component, multiplier){
		var tabItems        = component.querySelectorAll(".tab-content-item"),
			tabSelects      = component.querySelectorAll(".tab-select-item"),
			tabIndicator    = component.querySelector(".tabs-indicator"),
			tabContent      = component.querySelector(".tabs-content"),
			tabContentWidth = tabContent.clientWidth;

		// TODO: Improve this
		if(tabIndicator){
			var tabIndicatorWidth = tabIndicator.clientWidth,
				indicatorOffset   = (tabIndicatorWidth * multiplier);

			tabIndicator.style.transform = `translateX(${indicatorOffset}px)`;
			

			for(i = 0; tabSelects.length > i; i++){
				var tabSelect = tabSelects.item(i);

				// Give the active class to selected tab
				if(i == multiplier){
					tabSelect.classList.add("active");
				}

				// Remove the active class to the rest of the tabs if the contain it
				else if(tabSelect.classList.contains("active")){
					tabSelect.classList.remove("active");
				}
			}
		}
		
		for(i = 0; tabItems.length > i; i++){
			var tabItem = tabItems.item(i),
				offset  = (tabContentWidth * multiplier) * -1;

			// Animate the transition between tab contents when selected a tab
			tabItem.style.transform = `translateX(${offset}px)`;
		}
	}

	/**
	 * Resizes all tab indicators whenever the browser changes its size
	 */
	function resizeIndicators(){
		for(i = 0; tabs.length > i; i++){
			var tab          = tabs.item(i),
				tabSelect    = tab.querySelector(".tab-select-item"),
				tabIndicator = tab.querySelector(".tabs-indicator");

			if(tabIndicator){
				var translateX = getTranslateX(tabIndicator),
					offset     = (translateX - tabSelect.clientWidth) * -1;

				// Give the indicator the new size
				tabIndicator.style.width = tabSelect.clientWidth + "px";

				// Reposition the indicator offset whenever it's offset is not in the first tab
				if(translateX != 0){
					tabIndicator.style.transform = `translateX(${tabSelect.clientWidth + offset}px)`
				}
			}
		}
	}

	/**
	 * Gets the translateX transform value from a provided element
	 * 
	 * @param  {Element} element The element where to extract the computed value
	 * @return {Number}          The computed value of translateX
	 */
	function getTranslateX(element){
		var style  = window.getComputedStyle(element),
			matrix = new WebKitCSSMatrix(style.webkitTransform);

		return matrix.m41;
	}
}