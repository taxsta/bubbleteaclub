/***
 * The js file to do operation on "Add to cart" to avoid issue that clicking it before entire page being loaded
 ***/

// Forbid "Add to cart" button until the page being loaded
document.addEventListener("DOMContentLoaded", function() {
    const submitButton = document.querySelector(".product-form__submit");
    submitButton.disabled = true;
});

// start to use "Add to cart" button when the entire page already being loaded
window.addEventListener("load", function() {
    var submitButton = document.querySelector(".product-form__submit");
    submitButton.disabled = false;
});