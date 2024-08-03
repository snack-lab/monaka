import sheet from './roles_style.css' with { type: "text/css"};

class RolesElement extends HTMLElement {
  #root;

  // static get observedAttributes() {}

  static formAssociated = true;

  constructor() {
    super();
    this._internals = this.attachInternals();
    this.#root = this.attachShadow({ mode: 'closed' });
    this.#root.adoptedStyleSheets.push(sheet);
    this.#root.appendChild(this.#template());
  }

  // connectedCallback() {}
  // disconnectedCallback() {}
  // adoptedCallback() {}
  // attributeChangedCallback(name, oldValue, newValue) {}
  // formAssociatedCallback(form) {}
  // formDisabledCallback(disabled) {}
  // formResetCallback() {}
  // formStateRestoreCallback(state, mode) {}

  setCurrentRole = currentRole => {
    if (Number.isInteger(currentRole)) {
      this.#changeCurrentRole(currentRole);

      const entries = new FormData();
      entries.append('roles', currentRole);
      this._internals.setFormValue(entries);
    }
  };

  setRoles = roles => {
    if (Array.isArray(roles)) {
      this.#showRoles(roles);
    }
  };

  setErrors = errors => {
    this.#showErrors(errors);
  };

  #changeCurrentRole = currentRole => {
    const roles = this.#root.querySelectorAll('.roles_content .roles input[type="radio"]');
    roles.forEach(role => {
      if (Number(role.value) === currentRole) {
        role.checked = true;
      } else {
        role.checked = false;
      }
    });
  };

  #showRoles = roles => {
    roles.forEach(role => {
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'roles';
      radio.id = `role_${role.id}`;
      radio.value = role.id;
      radio.onchange = event => this.setCurrentRole(Number(event.target.value));

      const label = document.createElement('label');
      label.setAttribute('for', `role_${role.id}`);
      label.textContent = role.label;

      const div = document.createElement('div');
      div.appendChild(radio);
      div.appendChild(label);

      const rolesContent = this.#root.querySelector('.roles_content .roles');
      rolesContent.appendChild(div);
    });
  };

  #showErrors = errors => {
    const showErrors = `<strong>${errors}</strong></span>`;
    const msg = this.#root.querySelector('.roles_content .error-msg');
    msg.textContent = showErrors;
  };

  #template = () => {
    const template = document.createElement('template');
    template.innerHTML = `
    <div class="roles_content">
      <div class="roles"></div>
      <span class="error-msg"></span>
    </div>`;
    return template.content.cloneNode(true);
  };
}

customElements.define('m-roles', RolesElement);
