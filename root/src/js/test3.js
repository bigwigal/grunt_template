(function() {
	var $regions,
		$regionPaths,
		$detailedRegions,
		brewerLength,
		links,
		regionNames = { 
			aosta: 'Valle d\'Aosta', piemonte: 'Piemonte', lombardia: 'Lombardia', trentino: 'Trentino-Alto Adige', veneto: 'Veneto', friuli: 'Friuli Venezia Giulia', liguria: 'Liguria', emilia: 'Emilia-Romagna', toscana: 'Toscana', umbria: 'Umbria', marche: 'Marche', lazio: 'Lazio', abruzzo: 'Abruzzo', molise: 'Molise', campania: 'Campania', puglia: 'Puglia', basilicata: 'Basilicata', calabria: 'Calabria', sicilia: 'Sicilia', sardegna: 'Sardegna'
		};

	//.then() doesn't fire if request fails...
	/*$.get('images/map.svg', null, null, 'xml').then(function(data) {
		svg = data;
		if (VLE.serverversion) {
			VLE.get_attachment('links', success, error);
		} else {
			links = testLinks;
		}
	}).done(function(data) {
		$(document).ready(function() {
			init();
		});
	}).fail(function() {
		$(document).ready(function() {
			addLinks();
		});
	});*/
		
	$.get('images/map.svg', null, null, 'xml').always(function(data) {
		svg = data;
		if (VLE.serverversion) {
			VLE.get_attachment('links', success, error);
		} else {
			links = testLinks;
			$(document).ready(function() {
				init();
			});
		}
	});

	function success(text, xmldocument) {
		links = JSON.parse(text);
		$(document).ready(function() {
			init();
		});
	}
	
	function error(message) {
		console.log(message);
	}
	
	function init() {
		//Append SVG and remove CSS
		$(svg).find('svg').attr('id', 'main_svg').appendTo('#interactive');
		$('#container').find('style').remove();
	
		//Set globals
		brewerLength = colorbrewer.length;
		$regions = $('#regions').children();
		$detailedRegions = $('#provinces').children();
		$regionPaths = $regions.children().find('g');

		//Initialise
		addHooks();
		addColour();
		bindEvents();
		addLinks();
	}
	
	function addHooks() {
		$('#other path').add('#other polygon').attr('class', 'country other');
		$('#italyborder').attr({ 'id': 'italy', 'class': 'country' });
		$('#italyfill').attr('id', 'italy_fill');
		$regions.attr('class', 'region');
		$detailedRegions.attr('class', 'province');
		$detailedRegions.each(function(i) {
			$(this).children().eq(1).attr('class', 'region_border');
			if (i === 0) {
				$(this).find('text').attr('class', 'capital');
			} else {
				$(this).children().eq(0).children().eq(0).find('text').attr('class', 'capital');
			}
		});
	}

	function addColour() {
		$detailedRegions.each(function(i) {
			var regionIndex = i;
			var $provinces = $(this).children().eq(0).children();

			if (regionIndex >= brewerLength) {
				regionIndex -= brewerLength;
			}
			$provinces.each(function(i) {
				var arrayLength = colorbrewer[regionIndex].length;
				if (i >= arrayLength) {
					i -= arrayLength;
				}
				$(this).find('path, polygon').css('fill', colorbrewer[regionIndex][i]);
			});
		});
		
		$regionPaths.each(function(i) {
			if (i >= brewerLength) {
				i -= brewerLength;
			}
			$(this).children().css('fill', colorbrewer[i][3]);
		});
	}

	function bindEvents() {
		$regions
			.on('mouseenter focusin', highlight)
			.on('mouseleave focusout', removeHighlight)
			.on('click', popupRegion);
		$('#lightbox').on('click keypress', '#close', closeLightbox);
		$('#vbutton').on('click', toggleVersion);
		$('#skiplink').on('click', function() {	$('#vbutton').focus(); });
	}

	function highlight(e) {
		$regions.not(e.delegateTarget).css('opacity', '.3');
	}

	function removeHighlight(e) {
		$regions.css('opacity', '1');
	}

	function popupRegion(e) {
		if ($('#svgpopup').length < 1) {
			var $svgPopup = $('<svg xmlns="http://www.w3.org/2000/svg" viewBox="75 30 360 450" id="svgpopup"></svg>');
			var elementIndex = $regions.index(e.delegateTarget);
			var $popupRegion = $detailedRegions.eq(elementIndex).clone().show();
			var id = $(e.delegateTarget).attr('id');
			var link = links[id];
			
			$('#reg_head span').html(regionNames[id]);
			$svgPopup.append($popupRegion);
			$svgPopup.insertAfter('#close');
			$('#blog_link').attr('href', link).html(regionNames[id].toUpperCase() + ' blog');
			$('#lightbox').fadeIn(600);
			$('#close').focus();
			$('#lightbox').data('element', $(e.delegateTarget));
		}
	}

	function closeLightbox(e) {
		if (e.which == 1 || e.which == 13) {
			var $lightbox = $(e.delegateTarget);

			$lightbox.hide();
			$lightbox.find('svg').remove();
			$lightbox.data('element').focus();
		}
	}
	
	function addLinks() {
		$('.region_alt').append('<p>Follow this link to access the <a href="" target="_blank"></a>.</p>');
		$('.region_alt').each(function(i) {
			var $region = $(this).find('h2').html();
			var $anchor = $(this).find('a');

			for (var regionName in regionNames) {
				if (regionNames[regionName] == $region) {
					$anchor.attr('href', links[regionName])
						.attr('tabindex', i+2)
						.html($region.toUpperCase() + ' blog');
				}
			}
		});
	}
	
	function toggleVersion() {
		$(':focus').blur();
		if ($('#interactive').is(':visible')) {
			$('#vbutton').attr('tabindex', '22');
			$('#interactive').hide();
			$('#text_only').show();
			$('#vbutton').val('Interactive version');
			$('#skiplink').html('Go back to interactive version');
		} else {
			$('#vbutton').attr('tabindex', '');
			$('#interactive').show();
			$('#text_only').hide();		
			$('#vbutton').val('Text only version');
			$('#skiplink').html('Skip to accessible text only version');
		}
	}
		
})();