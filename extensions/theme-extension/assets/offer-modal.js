document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("offer-modal");
    const closeModal = document.querySelector(".offer-modal-close");
    const addOfferToCartButton = document.getElementById("add-offer-to-cart");
  
    // Replace this with your dynamic product ID later
    const offerProductId = "7356009381961";
  
    // Listen for cart updates
    document.addEventListener("cart:updated", () => {
      // Show the modal
      modal.style.display = "block";
  
      // Load offer product details dynamically
      fetch(`/products/${offerProductId}.json`)
        .then((response) => response.json())
        .then((data) => {
          const product = data.product;
          const offerDetails = `
            <h3>${product.title}</h3>
            <img src="${product.images[0]}" alt="${product.title}" width="150">
            <p>${product.price / 100} ${Shopify.currency.active}</p>
          `;
          document.getElementById("offer-product-details").innerHTML = offerDetails;
        })
        .catch((error) => console.error("Error loading product details:", error));
    });
  
    // Close modal
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  
    // Add offer product to cart
    addOfferToCartButton.addEventListener("click", () => {
      fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: offerProductId,
          quantity: 1,
        }),
      })
        .then(() => {
          alert("Offer product added to cart!");
          modal.style.display = "none";
        })
        .catch((error) => console.error("Error adding product to cart:", error));
    });
  
    // Close modal when clicking outside content
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  });
  