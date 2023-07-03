/***
 * Changelog
 * Add a if statement from line: 61 to 70
 * to check whether it is on the new design product page or not.
 * Bug1: There's a problem where now adding to cart on other pages doesn't update the cart and the drawer doesn't open
 * solved here
 *
 */
const style = document.createElement('style');
style.textContent = `
.mobile_button_animation {
  animation: fadeOut 5s;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
`;

document.head.appendChild(style);

if (!customElements.get('product-form')) {
    customElements.define('product-form', class ProductForm extends HTMLElement {
        constructor() {
            super();

            this.form = this.querySelector('form');
            this.form.querySelector('[name=id]').disabled = false;
            this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
            this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
            this.submitButton = this.querySelector('[type="submit"]');
            if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');
        }

        onSubmitHandler(evt) {
            // This is the session to store where the "Add to cart" has been clicked or not
            sessionStorage.setItem('atcBtnClicked', true);
            evt.preventDefault();
            if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

            this.handleErrorMessage();

            this.submitButton.setAttribute('aria-disabled', true);
            this.submitButton.classList.add('loading');
            this.querySelector('.loading-overlay__spinner').classList.remove('hidden');

            const config = fetchConfig('javascript');
            config.headers['X-Requested-With'] = 'XMLHttpRequest';
            delete config.headers['Content-Type'];

            const formData = new FormData(this.form);
            if (this.cart) {
                formData.append('sections', this.cart.getSectionsToRender().map((section) => section.id));
                formData.append('sections_url', window.location.pathname);
                this.cart.setActiveElement(document.activeElement);
            }
            config.body = formData;

            fetch(`${routes.cart_add_url}`, config)
                .then((response) => response.json())
                .then((response) => {
                    const mobile_add_button = document.getElementById('product_buy_mobile_button');
                    // The session to check whether it is new product
                    const isNew = sessionStorage.getItem("isNewDesignProduct");
                    // Only in the new product page, it will do the following operations of "Add to cart"
                    if( isNew === true) {
                        mobile_add_button.innerHTML = "Added Successfully";

                        mobile_add_button.classList.add("mobile_button_animation");

                        mobile_add_button.classList.remove("mobile_button_animation");
                    }

                    if (response.status) {
                        this.handleErrorMessage(response.description);

                        const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
                        if (!soldOutMessage) return;
                        this.submitButton.setAttribute('aria-disabled', true);
                        this.submitButton.querySelector('span').classList.add('hidden');
                        soldOutMessage.classList.remove('hidden');
                        this.error = true;
                        return;
                    } else if (!this.cart) {
                        window.location = window.routes.cart_url;
                        return;
                    }

                    this.error = false;
                    const quickAddModal = this.closest('quick-add-modal');
                    if (quickAddModal) {
                        document.body.addEventListener('modalClosed', () => {
                            setTimeout(() => {
                                this.cart.renderContents(response)
                            });
                        }, {once: true});
                        quickAddModal.hide(true);
                    } else {
                        this.cart.renderContents(response);
                    }
                    // var mobile_add_button = document.getElementById('product_buy_mobile_button');
                    // var originalContent = mobile_add_button.innerHTML;
                    // mobile_add_button.innerHTML = "Added Successfully";
                    //
                    // mobile_add_button.classList.add("mobile_button_animation");
                    //
                    //
                    // setTimeout(function () {
                    //     console.log("进来了");
                    //     mobile_add_button.classList.remove("mobile_button_animation");
                    //     // mobile_add_button.innerHTML = originalContent;
                    // }, 2000);


                })
                .catch((e) => {
                    console.error(e);
                })
                .finally(() => {
                    this.submitButton.classList.remove('loading');
                    if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
                    if (!this.error) this.submitButton.removeAttribute('aria-disabled');
                    this.querySelector('.loading-overlay__spinner').classList.add('hidden');
                });
        }

        handleErrorMessage(errorMessage = false) {
            this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
            if (!this.errorMessageWrapper) return;
            this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

            this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

            if (errorMessage) {
                this.errorMessage.textContent = errorMessage;
            }
        }
    });
}
