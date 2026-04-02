let cart = [];
let total = 0;

// Inventory System
let inventory = {
    'Margherita Pizza': { stock: 15, price: 200 },
    'Cheese Burger': { stock: 20, price: 120 },
    'Pasta Carbonara': { stock: 12, price: 180 },
    'Chicken Tacos': { stock: 18, price: 150 },
    'Noodles': { stock: 25, price: 100 },
    'Caesar Salad': { stock: 10, price: 140 }
};

function getStock(itemName) {
    return inventory[itemName] ? inventory[itemName].stock : 0;
}

function updateStock(itemName, quantity) {
    if(inventory[itemName]) {
        inventory[itemName].stock -= quantity;
        if(inventory[itemName].stock < 0) {
            inventory[itemName].stock = 0;
        }
    }
    updateInventoryDisplay();
    displayInventorySection();
}

function updateInventoryDisplay() {
    Object.keys(inventory).forEach(itemName => {
        let element = document.getElementById('stock-' + itemName.replace(/\s+/g, '-'));
        if(element) {
            element.textContent = inventory[itemName].stock;
        }
        
        let btn = document.querySelector(`button[data-item="${itemName}"]`);
        if(btn) {
            if(inventory[itemName].stock === 0) {
                btn.disabled = true;
                btn.textContent = '❌ Out of Stock';
                btn.style.opacity = '0.5';
                btn.classList.add('out-of-stock');
            } else {
                btn.disabled = false;
                btn.textContent = '+ Add';
                btn.style.opacity = '1';
                btn.classList.remove('out-of-stock');
            }
        }
    });
}

function displayInventorySection() {
    let inventoryHTML = '<table class="inventory-table"><tr><th>Item Name</th><th>Price</th><th>Stock Available</th><th>Status</th></tr>';
    Object.keys(inventory).forEach(itemName => {
        let item = inventory[itemName];
        let status = item.stock === 0 ? '❌ Out of Stock' : (item.stock < 5 ? '⚠️ Low Stock' : '✅ Available');
        inventoryHTML += `<tr>
            <td>${itemName}</td>
            <td>₹${item.price}</td>
            <td>${item.stock}</td>
            <td>${status}</td>
        </tr>`;
    });
    inventoryHTML += '</table>';
    
    let inventoryDiv = document.getElementById('inventory-display');
    if(inventoryDiv) {
        inventoryDiv.innerHTML = inventoryHTML;
    }
}

function increaseQty(id) {
    let input = document.getElementById(id);
    input.value = parseInt(input.value) + 1;
}

function decreaseQty(id) {
    let input = document.getElementById(id);
    if(parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

function addToCart(name, price) {
    let stock = getStock(name);
    
    if(stock === 0) {
        alert(`${name} is out of stock!`);
        return;
    }
    
    let existingItem = cart.find(item => item.name === name);
    
    if(existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({name, price, quantity: 1});
    }
    
    total += price;
    updateStock(name, 1);
    
    document.getElementById("cart-count").innerText = cart.length;
    updateCartDisplay();
}

function updateCartDisplay() {
    let cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = '';
    
    cart.forEach((item, index) => {
        let li = document.createElement("li");
        li.className = "cart-item";
        
        let itemInfo = document.createElement("div");
        itemInfo.className = "cart-item-info";
        itemInfo.innerHTML = `<div class="item-name">${item.name}</div><div class="item-price">₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}</div>`;
        
        let controls = document.createElement("div");
        controls.className = "cart-item-controls";
        
        let decreaseBtn = document.createElement("button");
        decreaseBtn.className = "qty-mod-btn";
        decreaseBtn.textContent = "−";
        decreaseBtn.setAttribute("data-index", index);
        decreaseBtn.addEventListener("click", function() {
            decreaseQtyInCart(parseInt(this.getAttribute("data-index")));
        });
        
        let qtyDisplay = document.createElement("span");
        qtyDisplay.className = "qty-display";
        qtyDisplay.textContent = item.quantity;
        
        let increaseBtn = document.createElement("button");
        increaseBtn.className = "qty-mod-btn";
        increaseBtn.textContent = "+";
        increaseBtn.setAttribute("data-index", index);
        increaseBtn.addEventListener("click", function() {
            increaseQtyInCart(parseInt(this.getAttribute("data-index")));
        });
        
        let removeBtn = document.createElement("button");
        removeBtn.className = "remove-btn";
        removeBtn.textContent = "❌";
        removeBtn.setAttribute("data-index", index);
        removeBtn.addEventListener("click", function() {
            removeFromCart(parseInt(this.getAttribute("data-index")));
        });
        
        controls.appendChild(decreaseBtn);
        controls.appendChild(qtyDisplay);
        controls.appendChild(increaseBtn);
        controls.appendChild(removeBtn);
        
        li.appendChild(itemInfo);
        li.appendChild(controls);
        cartItems.appendChild(li);
    });
    
    document.getElementById("total").innerText = total;
    document.getElementById("header-total").innerText = total;
    
    // Show buttons if cart is not empty
    if(cart.length > 0) {
        document.getElementById("proceed-btn").style.display = "inline-block";
        document.getElementById("clear-btn").style.display = "inline-block";
    } else {
        document.getElementById("proceed-btn").style.display = "none";
        document.getElementById("clear-btn").style.display = "none";
        document.getElementById("payment-section").style.display = "none";
    }
}

function increaseQtyInCart(index) {
    if(index >= 0 && index < cart.length) {
        total += cart[index].price;
        cart[index].quantity += 1;
        updateCartDisplay();
    }
}

function decreaseQtyInCart(index) {
    if(index >= 0 && index < cart.length) {
        if(cart[index].quantity > 1) {
            total -= cart[index].price;
            cart[index].quantity -= 1;
            updateCartDisplay();
        }
    }
}

function removeFromCart(index) {
    if(index > -1 && index < cart.length) {
        total -= cart[index].price * cart[index].quantity;
        cart.splice(index, 1);
        document.getElementById("cart-count").innerText = cart.length;
        updateCartDisplay();
    }
}

function clearCart() {
    if(confirm("Are you sure you want to clear the cart?")) {
        cart = [];
        total = 0;
        document.getElementById("cart-count").innerText = 0;
        document.getElementById("total").innerText = 0;
        document.getElementById("header-total").innerText = 0;
        document.getElementById("cart-items").innerHTML = '';
        document.getElementById("proceed-btn").style.display = "none";
        document.getElementById("clear-btn").style.display = "none";
        document.getElementById("payment-section").style.display = "none";
    }
}

function proceedToPayment() {
    if(cart.length === 0) {
        alert("Cart is empty! Add items first.");
        return;
    }
    document.getElementById("payment-section").style.display = "block";
    document.getElementById("proceed-btn").style.display = "none";
}

function cancelPayment() {
    document.getElementById("payment-section").style.display = "none";
    document.getElementById("proceed-btn").style.display = "inline-block";
    document.getElementById("customer-name").value = '';
    document.getElementById("customer-address").value = '';
    document.getElementById("customer-phone").value = '';
}

function processPayment() {
    let name = document.getElementById("customer-name").value.trim();
    let address = document.getElementById("customer-address").value.trim();
    let phone = document.getElementById("customer-phone").value.trim();
    let paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    if(!name || !address || !phone) {
        alert("Please fill all details!");
        return;
    }
    
    if(phone.length !== 10 || isNaN(phone)) {
        alert("Please enter a valid 10-digit phone number!");
        return;
    }
    
    let order = {
        items: cart,
        total: total,
        customer: {name, address, phone},
        payment: paymentMethod,
        date: new Date().toLocaleString()
    };
    
    console.log("Order Placed:", order);
    alert(`Order Confirmed!\n\nName: ${name}\nTotal: ₹${total}\nPayment: ${paymentMethod.toUpperCase()}\n\nThank you for ordering!`);
    
    // Reset
    cart = [];
    total = 0;
    document.getElementById("cart-count").innerText = 0;
    document.getElementById("total").innerText = 0;
    document.getElementById("header-total").innerText = 0;
    document.getElementById("cart-items").innerHTML = '';
    document.getElementById("proceed-btn").style.display = "none";
    document.getElementById("clear-btn").style.display = "none";
    document.getElementById("payment-section").style.display = "none";
    document.getElementById("customer-name").value = '';
    document.getElementById("customer-address").value = '';
    document.getElementById("customer-phone").value = '';
    updateInventoryDisplay();
}

window.addEventListener('DOMContentLoaded', function() {
    updateInventoryDisplay();
    displayInventorySection();
});
