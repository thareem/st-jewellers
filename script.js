function getCart() {
  return JSON.parse(localStorage.getItem('st_jewelers_cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('st_jewelers_cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(name, price, imageSrc) {
  let cart = getCart();
  cart.push({ name: name, price: price, image: imageSrc });
  saveCart(cart);
  alert(name + " basket mein add ho gaya hai!");
  window.location.href = "cart.html";
}

function updateCartBadge() {
  let cart = getCart();
  let badge = document.getElementById('cart-count-badge');
  if (badge) {
    badge.innerText = cart.length;
  }
}

function togglePaymentFields() {
  let onlinePaymentBox = document.getElementById('online-payment-details');
  let selectedMethod = document.querySelector('input[name="payment_method"]:checked').value;
  
  if (selectedMethod === 'online') {
    onlinePaymentBox.style.display = 'block';
  } else {
    onlinePaymentBox.style.display = 'none';
  }
  
  renderCart();
}

function renderCart() {
  let cartBody = document.getElementById('cart-items-body');
  let subtotalElement = document.getElementById('cart-subtotal');
  let deliveryElement = document.getElementById('cart-delivery-fee');
  let totalPriceElement = document.getElementById('cart-total-price');
  
  if (!cartBody) return;

  let cart = getCart();
  cartBody.innerHTML = "";

  if (cart.length === 0) {
    cartBody.innerHTML = "<tr><td colspan='3' style='text-align:center;'>Aapka basket abhi khaali hai!</td></tr>";
    subtotalElement.innerText = "PKR 0";
    deliveryElement.innerText = "PKR 0";
    totalPriceElement.innerText = "PKR 0";
    return;
  }

  let subtotal = 0;
  cart.forEach((item, index) => {
    let priceNum = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
    subtotal += priceNum;

    let row = `
      <tr>
        <td><strong>${item.name}</strong></td>
        <td>${item.price}</td>
        <td><button onclick="removeFromCart(${index})" style="background:#800020; color:#fff; border:1px solid #d4af37; padding:4px 8px; cursor:pointer;">Remove</button></td>
      </tr>
    `;
    cartBody.innerHTML += row;
  });

  let paymentMethod = 'cod';
  let paymentRadio = document.querySelector('input[name="payment_method"]:checked');
  if (paymentRadio) {
    paymentMethod = paymentRadio.value;
  }

  let deliveryFee = (paymentMethod === 'cod') ? 200 : 0;
  let finalTotal = subtotal + deliveryFee;

  subtotalElement.innerText = "PKR " + subtotal.toLocaleString();
  deliveryElement.innerText = "PKR " + deliveryFee.toLocaleString();
  totalPriceElement.innerText = "PKR " + finalTotal.toLocaleString();
}

function removeFromCart(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

function handlePlaceOrder(event) {
  event.preventDefault();
  let cart = getCart();

  if (cart.length === 0) {
    alert("Aapka basket khali hai!");
    return;
  }

  let name = document.getElementById('cust-name').value;
  let phone = document.getElementById('cust-phone').value;
  let paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;

  if (paymentMethod === 'online') {
    let cardName = document.getElementById('card-name').value;
    let cardNumber = document.getElementById('card-number').value;
    if (!cardName || !cardNumber) {
      alert("Kripya online payment details poori bharein!");
      return;
    }
  }

  let methodText = (paymentMethod === 'cod') ? "Cash on Delivery (Including PKR 200 Delivery Fee)" : "Online Payment";

  alert(`Shukriya ${name}!\n\nAapka order successfully place ho gaya hai.\nPayment Method: ${methodText}\n\nHum jald hi ${phone} par contact karenge.`);

  localStorage.removeItem('st_jewelers_cart');
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderCart();
});