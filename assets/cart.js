class CartRemoveButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", (event) => {
      event.preventDefault();
      const cartItems =
        this.closest("cart-items") || this.closest("cart-drawer-items");
      cartItems.updateQuantity(this.dataset.variant, this.dataset.index, 0);
    });
  }
}

customElements.define("cart-remove-button", CartRemoveButton);


class CartItems extends HTMLElement {
  constructor() {
    super();

    this.isOnChangeCalled = false;

    this.lineItemStatusElement =
      document.getElementById("shopping-cart-line-item-status") ||
      document.getElementById("CartDrawer-LineItemStatus");

    this.currentItemCount = Array.from(
      this.querySelectorAll('[name="updates[]"]')
    ).reduce(
      (total, quantityInput) => total + parseInt(quantityInput.value),
      0
    );

    this.debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, 300);

    this.addEventListener("change", this.debouncedOnChange.bind(this));
  }

  onChange(event) {
    this.updateQuantity(
      event.target.dataset.variant,
      event.target.dataset.index,
      event.target.value,
      document.activeElement.getAttribute("name"),
      this.isOnChangeCalled = true,
  );
  }

  getSectionsToRender() {
    return [
      {
        id: "main-cart-items",
        section: document.getElementById("main-cart-items").dataset.id,
        selector: ".js-contents",
      },
      {
        id: "cart-icon-bubble",
        section: "cart-icon-bubble",
        selector: ".shopify-section",
      },
      {
        id: "cart-live-region-text",
        section: "cart-live-region-text",
        selector: ".shopify-section",
      },
      {
        id: "main-cart-footer",
        section: document.getElementById("main-cart-footer").dataset.id,
        selector: ".js-contents",
      },
    ];
  }
  updateQuantity(variant, line, quantity, name) {
    this.enableLoading(line);
    let updates = {};
    updates[variant] = quantity;

    const body = JSON.stringify({
      updates,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname,
    });

    fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body } })
      .then((response) => {
        return response.text();
      })
      .then(async (state) => {
        let parsedState = JSON.parse(state);
        console.log(parsedState)
        if(parsedState.total_price < 10000){
          let giftFound = false;
          parsedState.items.forEach(function(item,index){
            if(item.id == 40528338255933){
              giftFound = true
          }
            if(item.id == 40623943155773){
              giftFound = true
          }
        })
          if(giftFound = true){
              let updates = {
                        updates: {
                        40528338255933:"0",
                        40623943155773:"0"
                        },
                sections: ["cart-drawer", "cart-icon-bubble"],
                sections_url: window.location.pathname,
                          }
                        await fetch(window.Shopify.routes.root + 'cart/update.js', {
                          method: 'POST',
                          credentials: 'same-origin',
                          headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With':'xmlhttprequest' /* XMLHttpRequest is ok too, it's case insensitive */

                          },
                          body: JSON.stringify(updates)
                        })
                          .then((response) => {
        return response.text();
      })
                        .then((state) => {
                         parsedState = JSON.parse(state);
        console.log(parsedState)
                        })
          }
        } else if (parsedState.total_price < 14000){
          let giftFound = false;
          parsedState.items.forEach(function(item,index){
            if(item.id == 40528338255933){
              giftFound = true
          }
        })
          if(giftFound = true){
              let updates = {
                        updates: {
                        40528338255933:"0"
                        },
                sections: ["cart-drawer", "cart-icon-bubble"],
                sections_url: window.location.pathname,
                          }
                        await fetch(window.Shopify.routes.root + 'cart/update.js', {
                          method: 'POST',
                          credentials: 'same-origin',
                          headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With':'xmlhttprequest' /* XMLHttpRequest is ok too, it's case insensitive */

                          },
                          body: JSON.stringify(updates)
                        })
                          .then((response) => {
        return response.text();
      })
                        .then((state) => {
                         parsedState = JSON.parse(state);
        console.log(parsedState)
                        })
          }
        }

        this.classList.toggle("is-empty", parsedState.item_count === 0);
        const cartDrawerWrapper = document.querySelector("cart-drawer");
        const cartFooter = document.getElementById("main-cart-footer");

        if (cartFooter)
          cartFooter.classList.toggle("is-empty", parsedState.item_count === 0);
        if (cartDrawerWrapper)
          cartDrawerWrapper.classList.toggle(
            "is-empty",
            parsedState.item_count === 0
          );

        this.getSectionsToRender().forEach((section) => {
          const elementToReplace =
            document
              .getElementById(section.id)
              .querySelector(section.selector) ||
            document.getElementById(section.id);
          elementToReplace.innerHTML = this.getSectionInnerHTML(
            parsedState.sections[section.section],
            section.selector
          );
        });

        this.updateLiveRegions(line, parsedState.item_count);
        const lineItem =
          document.getElementById(`CartItem-${line}`) ||
          document.getElementById(`CartDrawer-Item-${line}`);
        if (lineItem && lineItem.querySelector(`[name="${name}"]`)) {
          cartDrawerWrapper
            ? trapFocus(
                cartDrawerWrapper,
                lineItem.querySelector(`[name="${name}"]`)
              )
            : lineItem.querySelector(`[name="${name}"]`).focus();
        } else if (parsedState.item_count === 0 && cartDrawerWrapper) {
          trapFocus(
            cartDrawerWrapper.querySelector(".drawer__inner-empty"),
            cartDrawerWrapper.querySelector("a")
          );
        } else if (document.querySelector(".cart-item") && cartDrawerWrapper) {
          trapFocus(
            cartDrawerWrapper,
            document.querySelector(".cart-item__name")
          );
        }
        this.disableLoading();
      })
      .catch(() => {
        this.querySelectorAll(".loading-overlay").forEach((overlay) =>
          overlay.classList.add("hidden")
        );
        const errors =
          document.getElementById("cart-errors") ||
          document.getElementById("CartDrawer-CartErrors");
        errors.textContent = window.cartStrings.error;
        this.disableLoading();
      });
  }

  updateLiveRegions(line, itemCount) {
    if (this.currentItemCount === itemCount) {
      const lineItemError =
        document.getElementById(`Line-item-error-${line}`) ||
        document.getElementById(`CartDrawer-LineItemError-${line}`);
      const quantityElement =
        document.getElementById(`Quantity-${line}`) ||
        document.getElementById(`Drawer-quantity-${line}`);
      lineItemError.querySelector(".cart-item__error-text").innerHTML =
        window.cartStrings.quantityError.replace(
          "[quantity]",
          quantityElement.value
        );
    }

    this.currentItemCount = itemCount;
    this.lineItemStatusElement.setAttribute("aria-hidden", true);

    const cartStatus =
      document.getElementById("cart-live-region-text") ||
      document.getElementById("CartDrawer-LiveRegionText");
    cartStatus.setAttribute("aria-hidden", false);

    setTimeout(() => {
      cartStatus.setAttribute("aria-hidden", true);
    }, 1000);
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, "text/html")
      .querySelector(selector).innerHTML;
  }

  enableLoading(line) {
    const mainCartItems =
      document.getElementById("main-cart-items") ||
      document.getElementById("CartDrawer-CartItems");
    mainCartItems.classList.add("cart__items--disabled");

    const cartItemElements = this.querySelectorAll(
      `#CartItem-${line} .loading-overlay`
    );
    const cartDrawerItemElements = this.querySelectorAll(
      `#CartDrawer-Item-${line} .loading-overlay`
    );

    [...cartItemElements, ...cartDrawerItemElements].forEach((overlay) =>
      overlay.classList.remove("hidden")
    );

    document.activeElement.blur();
    this.lineItemStatusElement.setAttribute("aria-hidden", false);
  }

  disableLoading() {
    const mainCartItems =
      document.getElementById("main-cart-items") ||
      document.getElementById("CartDrawer-CartItems");
    mainCartItems.classList.remove("cart__items--disabled");
  }
}

customElements.define("cart-items", CartItems);

if (!customElements.get("cart-note")) {
  customElements.define(
    "cart-note",
    class CartNote extends HTMLElement {
      constructor() {
        super();

        this.addEventListener(
          "change",
          debounce((event) => {
            const body = JSON.stringify({ note: event.target.value });
            fetch(`${routes.cart_update_url}`, {
              ...fetchConfig(),
              ...{ body },
            });
          }, 300)
        );
      }
    }
  );
}
