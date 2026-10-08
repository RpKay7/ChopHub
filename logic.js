
document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. SELECT HTML ELEMENTS
    // ==========================================

    const header = document.querySelector("#site-header");
    const nav = document.querySelector("header nav");
    const menuToggle = document.querySelector("#menu-toggle");
    const navLinks = document.querySelectorAll(".nav-links a");

    const categoryButtons = document.querySelectorAll(".category-btn");
    const menuItems = document.querySelectorAll(".menu-item");

    const menuSearch = document.querySelector("#menu-search");
    const clearSearch = document.querySelector("#clear-search");
    const noResults = document.querySelector("#no-results");

    const cartButton = document.querySelector("#cart-btn");
    const cartCount = document.querySelector("#cart-count");
    const cartOverlay = document.querySelector("#cart-overlay");
    const cartDrawer = document.querySelector("#cart-drawer");
    const cartClose = document.querySelector("#cart-close");
    const cartItemsContainer = document.querySelector("#cart-items");
    const emptyCart = document.querySelector("#empty-cart");
    const emptyCartButton = document.querySelector("#empty-cart-btn");
    const cartSubtotal = document.querySelector("#cart-subtotal");
    const checkoutButton = document.querySelector("#checkout-btn");

    const whatsappButton = document.querySelector("#whatsapp-btn");
    const orderButton = document.querySelector("#nav-order-btn");

    const toast = document.querySelector("#toast");
    const toastMessage = document.querySelector("#toast-message");

    // ==========================================
    // 2. MOBILE NAVIGATION
    // ==========================================

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("active");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );
        });
    }

    function closeMobileNav() {
        nav?.classList.remove("active");
        menuToggle?.setAttribute("aria-expanded", "false");
        menuToggle?.setAttribute("aria-label", "Open navigation menu");
    }

    navLinks.forEach(link => {
        link.addEventListener("click", closeMobileNav);
    });

    // ==========================================
    // 3. SMOOTH SCROLLING
    // ==========================================

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // ==========================================
    // 4. HEADER SCROLL EFFECT
    // ==========================================

    function updateHeader() {
        header?.classList.toggle("scrolled", window.scrollY > 50);
    }

    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    // ==========================================
    // 5. ACTIVE NAVIGATION LINK
    // ==========================================

    function updateActiveLink() {
        const sections = [
            ...document.querySelectorAll(
                "#home, #menu, #about, #reviews, #contact"
            )
        ];

        let currentSection = "home";

        sections.forEach(section => {
            if (section.getBoundingClientRect().top <= 150) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${currentSection}`
            );
        });
    }

    window.addEventListener("scroll", updateActiveLink, { passive: true });
    updateActiveLink();

    // ==========================================
    // 6. MENU SEARCH + CATEGORY FILTERS
    // ==========================================

    let selectedCategory = "all";

    function filterMenu() {
        const searchTerm = menuSearch?.value.trim().toLowerCase() || "";
        let visibleItems = 0;

        menuItems.forEach(item => {
            const itemCategory = item.dataset.category || "all";
            const itemName = (
                item.dataset.name || item.textContent
            ).toLowerCase();

            const matchesCategory =
                selectedCategory === "all" ||
                itemCategory === selectedCategory;

            const matchesSearch = itemName.includes(searchTerm);
            const shouldShow = matchesCategory && matchesSearch;

            item.style.display = shouldShow ? "" : "none";

            if (shouldShow) visibleItems++;
        });

        noResults?.classList.toggle("visible", visibleItems === 0);

        // CSS expects the "visible" class, not inline display styles.
        clearSearch?.classList.toggle("visible", searchTerm.length > 0);
    }

    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {
            categoryButtons.forEach(categoryButton => {
                categoryButton.classList.remove("active");
            });

            button.classList.add("active");
            selectedCategory = button.dataset.category || "all";

            filterMenu();
        });
    });

    menuSearch?.addEventListener("input", filterMenu);

    clearSearch?.addEventListener("click", () => {
        if (!menuSearch) return;

        menuSearch.value = "";
        filterMenu();
        menuSearch.focus();
    });

    // ==========================================
    // 7. TOAST NOTIFICATIONS
    // ==========================================

    let toastTimer;

    function showToast(message) {
        if (!toast || !toastMessage) {
            console.log(message);
            return;
        }

        toastMessage.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }

    // ==========================================
    // 8. SHOPPING CART
    // ==========================================

    let cart = [];

    function formatMoney(amount) {
        return "₦" + amount.toLocaleString("en-NG");
    }

    function updateCartCount() {
        if (!cartCount) return;

        const totalQuantity = cart.reduce(
            (total, item) => total + item.quantity,
            0
        );

        cartCount.textContent = totalQuantity;
    }

    function renderCart() {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = "";

        const cartIsEmpty = cart.length === 0;

        // Re-attach the original empty-cart element when needed.
        if (cartIsEmpty) {
            if (emptyCart) {
                emptyCart.style.display = "flex";
                cartItemsContainer.appendChild(emptyCart);
            }
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement("div");
                cartItem.className = "cart-item";

                const itemImage = document.createElement("img");
                itemImage.className = "cart-item-image";
                itemImage.src = item.image || "";
                itemImage.alt = item.name;

                if (!item.image) {
                    itemImage.style.display = "none";
                }

                const itemInfo = document.createElement("div");
                itemInfo.className = "cart-item-info";

                const itemName = document.createElement("h4");
                itemName.textContent = item.name;

                const itemPrice = document.createElement("p");
                itemPrice.className = "cart-item-price";
                itemPrice.textContent = formatMoney(item.price);

                const quantityControls = document.createElement("div");
                quantityControls.className = "cart-quantity";

                const decreaseButton = document.createElement("button");
                decreaseButton.type = "button";
                decreaseButton.className = "quantity-btn";
                decreaseButton.textContent = "−";
                decreaseButton.setAttribute(
                    "aria-label",
                    `Decrease ${item.name} quantity`
                );

                const quantityNumber = document.createElement("span");
                quantityNumber.className = "quantity-number";
                quantityNumber.textContent = item.quantity;

                const increaseButton = document.createElement("button");
                increaseButton.type = "button";
                increaseButton.className = "quantity-btn";
                increaseButton.textContent = "+";
                increaseButton.setAttribute(
                    "aria-label",
                    `Increase ${item.name} quantity`
                );

                const removeButton = document.createElement("button");
                removeButton.type = "button";
                removeButton.className = "remove-item";
                removeButton.textContent = "Remove";

                decreaseButton.addEventListener("click", () => {
                    changeQuantity(item.name, -1);
                });

                increaseButton.addEventListener("click", () => {
                    changeQuantity(item.name, 1);
                });

                removeButton.addEventListener("click", () => {
                    removeFromCart(item.name);
                });

                quantityControls.append(
                    decreaseButton,
                    quantityNumber,
                    increaseButton
                );

                itemInfo.append(
                    itemName,
                    itemPrice,
                    quantityControls,
                    removeButton
                );

                cartItem.append(itemImage, itemInfo);
                cartItemsContainer.appendChild(cartItem);
            });
        }

        const subtotal = cart.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        if (cartSubtotal) {
            cartSubtotal.textContent = formatMoney(subtotal);
        }

        updateCartCount();
    }

    // ==========================================
    // 9. ADD ITEMS TO CART
    // ==========================================

    function addToCart(name, price, image) {
        if (!name || !Number.isFinite(price) || price <= 0) {
            showToast("Sorry, this item could not be added.");
            return;
        }

        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name,
                price,
                quantity: 1,
                image: image || ""
            });
        }

        renderCart();
        showToast(`${name} added to cart!`);
    }

    document.querySelectorAll(".add-btn").forEach(button => {
        button.addEventListener("click", () => {
            // Find the full food card, not just the Add button.
            const foodCard = button.closest(".food-card, .menu-item");

            if (!foodCard) {
                showToast("Could not find this meal.");
                return;
            }

            // Your Add buttons contain the actual price and item name.
            const name = button.dataset.name;
            const price = Number(button.dataset.price);
            const imageElement = foodCard.querySelector("img");
            const image = imageElement?.src || "";

            addToCart(name, price, image);

            const originalText =
                button.dataset.originalText || button.textContent;

            if (!button.dataset.originalText) {
                button.dataset.originalText = originalText;
            }

            button.textContent = "Added ✓";
            button.classList.add("added");

            setTimeout(() => {
                button.textContent = button.dataset.originalText;
                button.classList.remove("added");
            }, 1200);
        });
    });

    // ==========================================
    // 10. CHANGE QUANTITY + REMOVE ITEMS
    // ==========================================

    function changeQuantity(name, change) {
        const item = cart.find(cartItem => cartItem.name === name);

        if (!item) return;

        item.quantity += change;

        if (item.quantity <= 0) {
            cart = cart.filter(cartItem => cartItem.name !== name);
        }

        renderCart();
    }

    function removeFromCart(name) {
        cart = cart.filter(item => item.name !== name);

        renderCart();
        showToast(`${name} removed from cart.`);
    }

    // ==========================================
    // 11. OPEN + CLOSE CART
    // ==========================================

    function openCart() {
        cartOverlay?.classList.add("active");
        cartDrawer?.classList.add("active");
        document.body.classList.add("cart-open");

        cartButton?.setAttribute("aria-expanded", "true");
    }

    function closeCart() {
        cartOverlay?.classList.remove("active");
        cartDrawer?.classList.remove("active");
        document.body.classList.remove("cart-open");

        cartButton?.setAttribute("aria-expanded", "false");
    }

    cartButton?.addEventListener("click", openCart);
    cartClose?.addEventListener("click", closeCart);
    cartOverlay?.addEventListener("click", closeCart);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeCart();
            closeMobileNav();
        }
    });

    emptyCartButton?.addEventListener("click", () => {
        closeCart();

        document.querySelector("#menu")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    // ==========================================
    // 12. WHATSAPP CHECKOUT
    // ==========================================

    const whatsappNumber = "2347068414697";

    function checkoutOnWhatsApp() {
        if (cart.length === 0) {
            showToast("Your cart is empty. Add a meal first.");
            closeCart();

            document.querySelector("#menu")?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            return;
        }

        const subtotal = cart.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        let message = "Hello ChopHub! 👋\n";
        message += "I'd like to place an order:\n\n";

        cart.forEach(item => {
            message += `${item.name} x ${item.quantity} — `;
            message += `${formatMoney(item.price * item.quantity)}\n`;
        });

        message += `\nSubtotal: ${formatMoney(subtotal)}\n`;
        message += "\nPlease confirm my order. Thank you!";

        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappURL, "_blank", "noopener,noreferrer");
    }

    checkoutButton?.addEventListener("click", checkoutOnWhatsApp);

    whatsappButton?.addEventListener("click", () => {
        if (cart.length > 0) {
            checkoutOnWhatsApp();
            return;
        }

        const message = encodeURIComponent(
            "Hello ChopHub! 👋 I'd like to make an enquiry about your menu."
        );

        window.open(
            `https://wa.me/${whatsappNumber}?text=${message}`,
            "_blank",
            "noopener,noreferrer"
        );
    });

    // ==========================================
    // 13. ORDER NOW BUTTON
    // ==========================================

    orderButton?.addEventListener("click", () => {
        document.querySelector("#menu")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    // ==========================================
    // 14. INITIALISE
    // ==========================================

    renderCart();
    filterMenu();

    console.log("ChopHub JavaScript loaded successfully! 🍔");
});

