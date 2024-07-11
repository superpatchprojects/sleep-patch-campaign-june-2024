(function ($) {
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
		document.querySelectorAll('.add-to-cart-btn').forEach(button => {
			button.addEventListener('click', function () {
				document.getElementById('cartModalOverlay').style.display = 'block';
			});
		});

		document.querySelector('.close-btn').addEventListener('click', function () {
			document.getElementById('cartModalOverlay').style.display = 'none';
		});

		const plusButtons = document.querySelectorAll('.plus-btn');
		const minusButtons = document.querySelectorAll('.minus-btn');
		const inputFields = document.querySelectorAll('.quantity');
		const quantitySelect = document.querySelector('.quantity-select');
		const totalPriceElement = document.getElementById('totalPrice');
		const pricePerItem = 60.00;

		function updateQuantities(value) {
			inputFields.forEach(input => {
				input.value = value;
			});
			quantitySelect.value = value;
			updateTotalPrice(value);
		}

		function updateTotalPrice(quantity) {
			const totalPrice = pricePerItem * quantity;
			totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
		}

		plusButtons.forEach(button => {
			button.addEventListener('click', function () {
				let newValue = parseInt(inputFields[0].value) + 1;
				if (newValue <= 10) {
					updateQuantities(newValue);
				}
			});
		});

		minusButtons.forEach(button => {
			button.addEventListener('click', function () {
				let currentValue = parseInt(inputFields[0].value);
				if (currentValue > 1) {
					let newValue = currentValue - 1;
					updateQuantities(newValue);
				}
			});
		});

		quantitySelect.addEventListener('change', function () {
			let newValue = parseInt(this.value);
			updateQuantities(newValue);
		});
		
	});
})(jQuery);

(function (Client) {
	window.client = Client.buildClient({
		domain: 'a0c1e3-25.myshopify.com',
		storefrontAccessToken: '87f20013717bc33265c0ab86ead28dc0'
	});
})(ShopifyBuy)
