
// https://glitch.com/edit/#!/construct-stylesheets

const stylesheet = new CSSStyleSheet();

const CSS = `
:host {
	display: flex;
	flex-direction: column;
	position: absolute;
	left: var(--x, 0px);
	top: var(--y, 0px);
	width: var(--width, 400px);
	height: var(--height, 300px);
	background: #fff;
	box-shadow: 0 5px 20px rgba(0,0,0,0.3);
	border-radius: 5px 5px 0 0;
	font: 14px/1.3 system-ui, helvetica, arial;
	transition: box-shadow 300ms ease;
	outline: none;
}

:host(:focus-within) {
	box-shadow: 0 10px 40px rgba(0,0,0,0.5);
	z-index: 1;
}

header {
	flex: 0 0 auto;
	padding: 4px;
	height: 16px;
	background: #ccc;
	border-radius: 5px 5px 0 0;
	box-shadow: inset 0 0.5px 0 rgba(255,255,255,0.5), inset 0 -0.5px 0 rgba(0,0,0,0.2);
	color: #666;
	text-align: center;
	text-shadow: 0 .5px 0 rgba(255,255,255,0.5);
	cursor: default;
	touch-action: none;
	user-select: none;
	user-drag: none;
}

:host > section {
	flex: 1;
	overflow: auto;
}
`;

let counter = 0;

function validatePosition(pos) {
	return Math.max(0, Math.round(pos));
}

const noop = () => {};
function createAliasProperty(prop, validate = String, onChange = noop) {
	return {
		enumerable: true,
		get() {
			return validate(this.getAttribute(prop));
		},
		set(value) {
			this.setAttribute(prop, value);
			if (onChange) onChange.call(this, prop, validate(value));
		}
	};
}

function updateAfterValidate(prop, value) {
	this.style.setProperty('--' + prop, value + 'px');
}

const config = {
	y: [validatePosition, updateAfterValidate],
	autofocus: [Boolean, noop],
	maximized: [Boolean, noop]
};

let zCount = 0;

let cur;
class MdiWindow extends HTMLElement {
	static get observedAttributes() {
		return ['width', 'height', 'x', 'y', 'autofocus', 'rolledup', 'maximized'];
	}

	constructor() {
		super();
		this._id = ++counter;

		const attrs = this.constructor.observedAttributes;
		for (let i = 0; i < attrs.length; i++) {
			const attr = attrs[i];
			const conf = config[attr] || [Math.round, updateAfterValidate];
			const desc = createAliasProperty(attr, conf[0], conf[1]);
			Object.defineProperty(this, attr, desc);
			if (this.hasAttribute(attr)) {
				desc.set.call(this, this.getAttribute(attr));
			}
		}

		const shadow = this.attachShadow({ mode: 'open' });
		shadow.adoptedStyleSheets = [stylesheet];
		shadow.innerHTML = `
      <header>
        <slot name="title">Window ${this._id}</slot>
      </header>
      <section>
        <slot></slot>
      </section>
      <footer>
        <slot name="footer"></slot>
      </footer>
    `.replace(/[\s\n]*\n[\s\n]*/g, '');

		const header = this.shadowRoot.firstChild;
		const preventDefault = e => {
			e.preventDefault();
			e.stopPropagation();
		};
		header.addEventListener('touchstart', preventDefault);
		header.addEventListener('dragstart', preventDefault);
		header.addEventListener('selectstart', preventDefault);
		const type = 'onpointerdown' in this ? 'pointer' : 'mouse';
		this.addEventListener(type + 'down', e => {
			this.focus();
			if (!e.path.includes(header) && !e.altKey) return;
			let start, x, y;
			const move = e => {
				if (!start) {
					x = this.x;
					y = this.y;
					start = e;
					return;
				}
				this.x = x + e.pageX - start.pageX;
				this.y = y + e.pageY - start.pageY;
				e.preventDefault();
				e.stopPropagation();
			};
			const up = e => {
				removeEventListener(type + 'move', move, true);
				removeEventListener(type + 'up', up, true);
				if (start) move(e);
			};
			addEventListener(type + 'move', move, true);
			addEventListener(type + 'up', up, true);
			preventDefault(e);
			return false;
		});
	}

	connectedCallback() {
		this.tabIndex = -1;
		// Only actually parse the stylesheet when the first instance is connected.
		if (stylesheet.cssRules.length == 0) {
			stylesheet.replaceSync(CSS);
		}
		if (this.autofocus) this.focus();
	}

	focus() {
		super.focus();
		this.style.zIndex = ++zCount;
	}
}

customElements.define('mdi-window', MdiWindow);

let x = 0;
window.newwin.addEventListener('click', () => {
	const offset = x++ % 10;
	const win = document.createElement('mdi-window');
	win.x = 100 + 20 * offset;
	win.y = 20 * offset;
	win.width = win.height = 100;
	win.autofocus = true;
	document.body.appendChild(win);
});
