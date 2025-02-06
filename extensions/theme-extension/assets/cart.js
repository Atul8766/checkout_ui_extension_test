// Example for triggering the event after an item is added to the cart
fetch("/cart/add.js", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    id: variantId, // Replace with the actual variant ID
    quantity: 1,
  }),
})
  .then(() => {
    document.dispatchEvent(new Event("cart:updated"));
  })
  .catch((error) => console.error("Error adding product to cart:", error));
