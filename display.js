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

class DOMDisplay {
	constructor(parent,level){
		this.dom = createElm("div",{class:"game"},drawGrid(level));
		this.actorLayer = null;
		parent.appendChild(this.dom);
	}

	clear() {this.dom.remove();}

}

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