// Opens up modal on hash		
if (window.location.hash) {
	var modalId = window.location.hash.substring(1);
	var modalElement = document.getElementById(modalId);
	if (modalElement) {
		var modal = new bootstrap.Modal(modalElement);
		modal.show();
	}
}

(async function ($, ShopifyBuy) {

	// save utm parameters to local storage
	var params = new URLSearchParams(location.search);
	params.entries().forEach(([k,v]) => sessionStorage.setItem(k,v));
	
	var customAttributes = ["Campaign","Source","Medium","Content","Term"].map( p => {
		return {"key": p, "value": sessionStorage.getItem("utm_"+p.toLowerCase())}
	}).filter( p => p.value );
	
	
	var shopifyClient = ShopifyBuy.buildClient({
		domain: 'checkout.supersleep.com',
		storefrontAccessToken: '87f20013717bc33265c0ab86ead28dc0'
	});

	var productId = "gid://shopify/Product/" + document.body.dataset.product;
	var variantId = "gid://shopify/ProductVariant/" + document.body.dataset.variant;
	var max_qty_available = parseInt(document.body.dataset.maxQuantity);

	var addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
	var checkoutButtons = document.querySelectorAll('[data-action="checkout"]');
	var plusButtons = document.querySelectorAll('.plus-btn');
	var minusButtons = document.querySelectorAll('.minus-btn');
	var inputFields = document.querySelectorAll('.quantity');
	var quantitySelect = document.querySelector('.quantity-select');
	var totalPriceElement = document.getElementById('totalPrice');
	var pricePerItem = 60.00;

	var checkout = await shopifyClient.checkout.create();
	
	checkout = await shopifyClient.checkout.updateAttributes(checkout.id, { customAttributes });
	
	$(document).ready(function () {
		// carousels
		$('.reviews').owlCarousel({
			loop: true,
			margin: 10,
			nav: false,
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 2
				},
				1000: {
					items: 3
				}
			}
		});

		$('.advisory-board').owlCarousel({
			loop: true,
			margin: 10,
			nav: false,
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 2
				},
				1000: {
					items: 3
				}
			}
		});

		$('.rem-percentage').owlCarousel({
			loop: true,
			margin: 10,
			nav: false,
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 2
				},
				1000: {
					items: 3
				}
			}
		});

		$('.wear-tech').owlCarousel({
			loop: true,
			margin: 10,
			nav: false,
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 2
				},
				1000: {
					items: 3
				}
			}
		});
	});

	// how it works video
	document.getElementById('playButton').addEventListener('click', function () {
		var container = document.querySelector('.video');
		var videoHtml = `
			<div class="col-md-8 offset-md-2 mb-4">
				<div class="ratio ratio-16x9">
					<iframe src="https://www.youtube.com/embed/d-nrcP5avSs?autoplay=1&rel=0" title="How It Works" allowfullscreen></iframe>
				</div>
			</div>
		`;

		container.innerHTML = videoHtml;

		var videoSection = document.querySelector('.video-section');
		videoSection.style.padding = '0';
	});


	// add to cart and cart modal
	inputFields.forEach(inp => inp.max = max_qty_available);

	addToCartButtons.forEach(button => {
		button.addEventListener('click', async function () {
			var spinner = this.nextElementSibling;

			var quantity = parseInt(button.closest(".row").querySelector("input").value);

			if (quantity == 0) return;

			setTimeout(() => {
				spinner.style.display = 'block';
			}, 100);

			checkout = await shopifyClient.checkout.addLineItems(checkout.id, { variantId, quantity });
			var new_qty_available = max_qty_available - checkout.lineItems[0].quantity;
			inputFields.forEach(inp => { inp.max = new_qty_available; inp.value = Math.min(1, new_qty_available); });
			quantitySelect.value = checkout.lineItems[0].quantity;
			updateTotalPrice(max_qty_available - new_qty_available);
			document.getElementById('cartModalOverlay').style.display = max_qty_available - new_qty_available == 0 ? '' : 'block';
			quantitySelect.closest(".row").querySelector('button').dataset.quantity = max_qty_available - new_qty_available;

			var event = new CustomEvent("add_to_cart", {
				"detail": {
					item_id: checkout.lineItems[0].variant.id.replace(/.*\//g, ""),
					item_sku: checkout.lineItems[0].variant.sku,
					item_name: checkout.lineItems[0].title,
					item_price: parseFloat(checkout.lineItems[0].variant.priceV2.amount),
					quantity: quantity
				}
			});
			document.dispatchEvent(event);

			spinner.style.display = 'none';
		});
	});

	quantitySelect.addEventListener('change', async function () {
		var spinner = this.nextElementSibling;

		setTimeout(() => {
			spinner.style.display = 'block';
		}, 100);

		var id = checkout.lineItems[0].id;
		var quantity = parseInt(this.value);

		checkout = await shopifyClient.checkout.updateLineItems(checkout.id, { id, quantity });
		var new_qty_available = max_qty_available - (checkout.lineItems[0] ? checkout.lineItems[0].quantity : 0);
		inputFields.forEach(inp => { inp.max = new_qty_available; inp.value = Math.min(1, new_qty_available); });
		updateTotalPrice(max_qty_available - new_qty_available);
		document.getElementById('cartModalOverlay').style.display = max_qty_available - new_qty_available == 0 ? '' : 'block';
		this.closest(".row").querySelector('button').dataset.quantity = max_qty_available - new_qty_available;

		var event = new CustomEvent("add_to_cart", {
			"detail": {
				item_id: checkout.lineItems[0].variant.id.replace(/.*\//g, ""),
				item_sku: checkout.lineItems[0].variant.sku,
				item_name: checkout.lineItems[0].title,
				item_price: parseFloat(checkout.lineItems[0].variant.priceV2.amount),
				quantity: quantity
			}
		});
		document.dispatchEvent(event);

		spinner.style.display = 'none';
	});

	checkoutButtons.forEach(ckbt => {
		ckbt.addEventListener('click', async function (e) {
			var this_checkout = checkout;
			e.preventDefault();
			var spinner = this.nextElementSibling;

			setTimeout(() => {
				spinner.style.display = 'block';
			}, 100);

			if (!(this_checkout.lineItems[0] && this_checkout.lineItems[0].variant)) {
				this_checkout = await shopifyClient.checkout.create()
					.then(temp_checkout => shopifyClient.checkout.updateAttributes(temp_checkout.id, { customAttributes }))
					.then(temp_checkout => shopifyClient.checkout.addLineItems(temp_checkout.id, { variantId, quantity: parseInt(this.dataset.quantity) }));

			}
			spinner.style.display = 'none';
			var event = new CustomEvent("init_checkout", {
				"detail": {
					quantity: this_checkout.lineItems.reduce((a, l) => a += l.quantity, 0),
					value: parseFloat(this_checkout.paymentDueV2.amount),
					items: this_checkout.lineItems.map(item => ({
						item_id: item.variant.id.replace(/.*\//g, ""),
						item_sku: item.variant.sku,
						item_name: item.title,
						item_price: parseFloat(item.variant.priceV2.amount),
						quantity: parseInt(item.quantity),
					}))
				}
			});
			document.dispatchEvent(event);
			await new Promise(r => setTimeout(r, 1000));
			location = this_checkout.webUrl;
		});
	})

	function updateQuantities(value) {
		inputFields.forEach(input => {
			input.value = value;
		});
	}

	function updateTotalPrice(quantity) {
		var totalPrice = pricePerItem * quantity;
		totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
	}

	inputFields.forEach(qtyfield => {
		qtyfield.addEventListener("change", function () {
			updateQuantities(Math.min(qtyfield.max, qtyfield.value));
		})
	})

	plusButtons.forEach(button => {
		button.addEventListener('click', function () {
			var newValue = parseInt(inputFields[0].value) + 1;
			updateQuantities(Math.min(newValue, inputFields[0].max));
		}); 
	});

	minusButtons.forEach(button => {
		button.addEventListener('click', function () {
			var currentValue = parseInt(inputFields[0].value);
			if (currentValue > 1) {
				var newValue = currentValue - 1;
				updateQuantities(Math.min(newValue, inputFields[0].max));
			}
		});
	});
})(jQuery, ShopifyBuy);
