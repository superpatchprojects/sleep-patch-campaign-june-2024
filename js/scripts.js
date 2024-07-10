(function($){
	$(document).ready(function () {
		$('.reviews').owlCarousel({
			loop: true,
			margin: 20,
			nav: true,
			autoHeight: true,
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
			margin: 20,
			nav: true,
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
			nav: true,
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
			nav: true,
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

		document.getElementById('playButton').addEventListener('click', function() {
			var container = document.querySelector('.video');
			var videoHtml = `
				<div class="col-md-6 offset-md-3">
					<div class="ratio ratio-16x9">
						<iframe src="https://www.youtube.com/embed/d-nrcP5avSs?autoplay=1&rel=0" title="How It Works" allowfullscreen></iframe>
					</div>
				</div>
				
			`;
			
			container.innerHTML = videoHtml;
		});

		const plusButton = document.querySelector('.plus-btn');
		const minusButton = document.querySelector('.minus-btn');
		const inputField = document.querySelector('.quantity');

		plusButton.addEventListener('click', function () {
		  inputField.value = parseInt(inputField.value) + 1;
		});

		minusButton.addEventListener('click', function () {
		  let currentValue = parseInt(inputField.value);
		  if (currentValue > 1) {
			inputField.value = currentValue - 1;
		  }
		});
	});
})(jQuery);

(function(Client){
	window.client = Client.buildClient({
	  domain: 'a0c1e3-25.myshopify.com',
	  storefrontAccessToken: '87f20013717bc33265c0ab86ead28dc0'
	});
})(ShopifyBuy)
