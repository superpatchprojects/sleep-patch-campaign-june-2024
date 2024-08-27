// Remove version based on UTM
(function(isV2){
	if (isV2) return document.getElementById('version-1').remove();
	return document.getElementById('version-2').remove();
})(window.is_v2)

// Opens up modal on hash		
if (window.location.hash) {
	var modalId = window.location.hash.substring(1);
	var modalElement = document.getElementById(modalId);
	if (modalElement && modalElement.classList.contains("modal")) {
		var modal = new bootstrap.Modal(modalElement);
		modal.show();
	}
}

(async function ($, ShopifyBuy) {

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

	$('#version-1 .wear-tech').owlCarousel({
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

	// save utm parameters to local storage
	const params = new URLSearchParams(location.search);
	params.forEach((v,k) => sessionStorage.setItem(k,v));
	
	const customAttributes = ["Campaign","Source","Medium","Content","Term","Version"].map( p => {
		return {"key": p, "value": sessionStorage.getItem("utm_"+p.toLowerCase())}
	}).filter( p => p.value );
	
	
	var checkout;
	const shopifyClient = ShopifyBuy.buildClient({
		domain: 'checkout.supersleep.com',
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

	document.getElementById('playButton').addEventListener('click', function () {
		var container = document.querySelector('.video');
		var videoHtml = `
			<div class="col-md-8 offset-md-2 mb-4">
				<div class="ratio ratio-16x9">
					<iframe src="https://www.youtube.com/embed/d-nrcP5avSs?autoplay=1&rel=0" title="How It Works" allow="autoplay; encrypted-media" allowfullscreen></iframe>
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
			if( !checkout ) checkout = await init_checkout(checkout);
			if( !checkout ) return showCartError();

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

			let event = new CustomEvent("add_to_cart", {
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
		if( !checkout ) checkout = await init_checkout(checkout);
		if( !checkout ) return showCartError();

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

		let event = new CustomEvent("add_to_cart", {
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
			if( !checkout ) checkout = await init_checkout(checkout);
			if( !checkout ) return showCartError();

			var this_checkout = checkout;
			e.preventDefault();
			const spinner = this.nextElementSibling;

			setTimeout(() => {
				spinner.style.display = 'block';
			}, 100);

			if (!(this_checkout.lineItems[0] && this_checkout.lineItems[0].variant)) {
				this_checkout = await shopifyClient.checkout.create()
					.then(temp_checkout => shopifyClient.checkout.updateAttributes(temp_checkout.id, { customAttributes }))
					.then(temp_checkout => shopifyClient.checkout.addLineItems(temp_checkout.id, { variantId, quantity: parseInt(this.dataset.quantity) }));

			}
			spinner.style.display = 'none';
			let event = new CustomEvent("init_checkout", {
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
	});

	function showCartError(){
		return alert("Our cart is experiencing some issues 😔. Please try again after sometime. We apologize for the inconvenience.");
	}

	async function init_checkout(checkout){
		checkout = await shopifyClient.checkout.create().catch(e => null);
		checkout = await shopifyClient.checkout.updateAttributes(checkout?.id, { customAttributes }).catch(e => null);
		return checkout;
	}

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
	
	checkout = await init_checkout(checkout);
	
})(jQuery, ShopifyBuy);
