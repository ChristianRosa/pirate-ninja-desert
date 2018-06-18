////Create and Display elements
//Create
function createElm (name,atts,...children){
	let dom = document.createElement(name);
	for (let att of Object.keys(atts)) {
		dom.setAttribute(att,atts[att]);
	}
	for(let child of children){
		dom.appendChild(child);
	}
	return dom;
}

//Display
class DOMDisplay {
	constructor(parent,level){
		this.dom = createElm("div",{class:"game"},drawGrid(level));
		this.actorLayer = null;
		parent.appendChild(this.dom);
	}

	clear() {this.dom.remove();}

}

//Enables display to show different states. Redraws actors as needed for movement
DOMDisplay.prototype.syncState = function(state){
	if(this.actorLayer) this.actorLayer.remove();
	this.actorLayer = drawActors(state.actors);
	this.dom.appendChild(this.actorLayer);
	this.dom.className = `game ${state.status}`;
	this.scrollPlayerIntoView(state);
};

const scale = 20;

function drawGrid(level) {
	return createElm("table",{
		class:"background",
		style:`width: ${level.width * scale}px`
	}, ...level.rows.map(row => 
		createElm("tr",{style: `height: ${scale}px`},
			...row.map(type => createElm("td", {class:type}))
		)));
}

function drawActors(actors){
	return createElm("div",{}, ...actors.map(actor => {
		let rect = createElm("div", {class:`actor ${actor.type}`});
		rect.style.width = `${actor.size.x * scale}px`;
		rect.style.height = `${actor.size.y * scale}px`;
		rect.style.left = `${actor.pos.x * scale}px`;
		rect.style.top = `${actor.pos.y * scale}px`;
		return rect;
	}));
}

//Makes sure player is always in view when moving
DOMDisplay.prototype.scrollPlayerIntoView = function(state) {
	let width = this.dom.clientWidth;
	let height = this.dom.clientHeight;
	let margin = width/3;

	let left = this.dom.scrollLeft, right = left + width;
	let top = this.dom.scrollTop, bottom = top + height;

	let player = state.player;
	let center = player.pos.plus(player.size.times(0.5)).times(scale);

	if(center.x < left + margin) {
		this.dom.scrollLeft = center.x - margin;
	} else if (center.x > right - margin) {
		this.dom.scrollLeft = center.x - margin - width;
	}
	if (center.y < top + margin) {
		this.dom.scrollTop = center.y - margin;
	} else if (center.y > bottom - margin) {
		this.dom.scrollTop = center.y + margin - height;
	}
};
