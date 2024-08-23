// Remove version based on UTM
(function (isV2) {
	if (isV2) return document.getElementById('version-1').remove();
	return document.getElementById('version-2').remove();
})(window.is_v2)

// Opens up modal on hash		
if (window.location.hash) {
	var modalId = window.location.hash.substring(1);
	var modalElement = document.getElementById(modalId);
	if (modalElement) {
		var modal = new bootstrap.Modal(modalElement);
		modal.show();
	}
}

jQuery(document).ready(function () {
	// carousels
	jQuery('.reviews').owlCarousel({
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

	jQuery('.advisory-board').owlCarousel({
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

	jQuery('.rem-percentage').owlCarousel({
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

	jQuery('.wear-tech').owlCarousel({
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

(function ($, ShopifyBuy) {

	if (!ShopifyBuy) {
		alert("Validating");
	} else {
		alert("Shopify Works");
	}
	
	alert("step2");
})(jQuery,ShopifyBuy);
