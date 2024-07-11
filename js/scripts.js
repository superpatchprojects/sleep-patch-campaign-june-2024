(async function ($, ShopifyBuy) {
	const shopifyClient = ShopifyBuy.buildClient({
		domain: 'a0c1e3-25.myshopify.com',
		storefrontAccessToken: '87f20013717bc33265c0ab86ead28dc0'
	});

	const productId = "gid://shopify/Product/" + document.body.dataset.product;
	const variantId = "gid://shopify/ProductVariant/" + document.body.dataset.variant;
	const max_qty_available = parseInt(document.body.dataset.maxQuantity);

	const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
	const checkoutButtons = document.querySelectorAll('[data-action="checkout"]');
	const plusButtons = document.querySelectorAll('.plus-btn');
	const minusButtons = document.querySelectorAll('.minus-btn');
	const inputFields = document.querySelectorAll('.quantity');
	const quantitySelect = document.querySelector('.quantity-select');
	const totalPriceElement = document.getElementById('totalPrice');
	const pricePerItem = 60.00;

	var checkout = await shopifyClient.checkout.create();

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
			const spinner = this.nextElementSibling;

			let quantity = parseInt(button.closest(".row").querySelector("input").value);

			if (quantity == 0) return;

			setTimeout(() => {
				spinner.style.display = 'block';
			}, 100);

			checkout = await shopifyClient.checkout.addLineItems(checkout.id, { variantId, quantity });
			let new_qty_available = max_qty_available - checkout.lineItems[0].quantity;
			inputFields.forEach(inp => { inp.max = new_qty_available; inp.value = Math.min(1, new_qty_available); });
			quantitySelect.value = checkout.lineItems[0].quantity;
			updateTotalPrice(max_qty_available - new_qty_available);
			document.getElementById('cartModalOverlay').style.display = max_qty_available - new_qty_available == 0 ? '' : 'block';
			quantitySelect.closest(".row").querySelector('button').dataset.quantity = max_qty_available - new_qty_available;

			spinner.style.display = 'none';
		});
	});

	quantitySelect.addEventListener('change', async function () {
		const spinner = this.nextElementSibling;

		setTimeout(() => {
			spinner.style.display = 'block';
		}, 100);

		let id = checkout.lineItems[0].id;
		let quantity = parseInt(this.value);

		checkout = await shopifyClient.checkout.updateLineItems(checkout.id, { id, quantity });
		let new_qty_available = max_qty_available - (checkout.lineItems[0] ? checkout.lineItems[0].quantity : 0);
		inputFields.forEach(inp => { inp.max = new_qty_available; inp.value = Math.min(1, new_qty_available); });
		updateTotalPrice(max_qty_available - new_qty_available);
		document.getElementById('cartModalOverlay').style.display = max_qty_available - new_qty_available == 0 ? '' : 'block';
		this.closest(".row").querySelector('button').dataset.quantity = max_qty_available - new_qty_available;

		spinner.style.display = 'none';
	});

	checkoutButtons.forEach(ckbt => {
		ckbt.addEventListener('click', async function (e) {
			e.preventDefault();
			const spinner = this.nextElementSibling;

			if (this.dataset.quantity != 0) {
				setTimeout(() => {
					spinner.style.display = 'block';
				}, 100);

				if (!checkout.lineItems[0]) {
					checkout = await shopifyClient.checkout.addLineItems(checkout.id, { variantId, quantity: parseInt(this.dataset.quantity) });
				}
				spinner.style.display = 'none';
				location = checkout.webUrl;
			}
		});
	})

	function updateQuantities(value) {
		inputFields.forEach(input => {
			input.value = value;
		});
	}

	function updateTotalPrice(quantity) {
		const totalPrice = pricePerItem * quantity;
		totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
	}

	inputFields.forEach(qtyfield => {
		qtyfield.addEventListener("change", function () {
			updateQuantities(Math.min(qtyfield.max, qtyfield.value));
		})
	})

	plusButtons.forEach(button => {
		button.addEventListener('click', function () {
			let newValue = parseInt(inputFields[0].value) + 1;
			updateQuantities(Math.min(newValue, inputFields[0].max));
		});
	});

	minusButtons.forEach(button => {
		button.addEventListener('click', function () {
			let currentValue = parseInt(inputFields[0].value);
			if (currentValue > 1) {
				let newValue = currentValue - 1;
				updateQuantities(Math.min(newValue, inputFields[0].max));
			}
		});
	});

	sessionStorage.setItem('leftCheckoutPage', 'true');
        
	        window.onload = function() {
	            var leftCheckout = sessionStorage.getItem('leftCheckoutPage');
	            if (leftCheckout) {
	                location.reload(); 
	                sessionStorage.removeItem('leftCheckoutPage'); 
	            }
	        }
})(jQuery, ShopifyBuy);
