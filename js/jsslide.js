/**
 * Slide class
 */
function JSSlideClass(options) {
	/**
	 * Constant. Count slides per each loading
	 */
	var COUNT_SLIDES_PER_LOAD = 3;

	/**
	 * Constant. Defines index of slide from the end of slide array, opening it, load new slides
	 */
	var WHEN_LOAD_NEW_SLIDES = 2;

	/**
	 * Constant that defines index of first slide. Usually equals 1
	 */
	var FIRST_SLIDE_INDEX = 1;

	/**
	 * Total count of slides
	 */
	this.totalSlides = options.totalSlides;

	/**
	 * jQuery container for dom-element with slide window
	 */
	this.container = options.container;

	/**
	 * jQuery container for input with current slide index
	 */
	this.slideIdxInput = options.slideIdxInput;

	/**
	 * Index of the current slide
	 */
	this.currentSlide = 0;

	/**
	 * Array with slides html
	 */
	this.slides = {};

	/**
	 * Counts loaded slides
	 */
	this.slidesCount = function() {
		var size = 0, key;
		for (key in this.slides) {
			if (this.slides.hasOwnProperty(key)) size++;
		}
		return size;
	}

	/**
	 * Loads more slides via ajax
	 * @param countSlides count of slides to download
	 */
	this.loadSlides = function (countSlides) {
		// default value
		countSlides = countSlides || 2;

		// starts several ajax threads to load each slide
		for (var i = this.currentSlide + 1; i <= (this.currentSlide + countSlides); i++) {

			// closure to keep context and slide index
			(function(context, i){
				if (context.slides[i] == undefined) {
					$.ajax({
						type: "GET",
						url: '/slides/' + i + '.html',
						dataType: 'html',
						context: context,
						success: function(data) {
							this.slides[i] = data;
						}
					});
				}
			})(this, i);
		}
	};

	/**
	 * Loads and show slide in slide window and load next and previous slides
	 * @param slideIdx index of slide to show
	 */
	this.show = function(slideIdx) {
		// cast slide index to integer
		slideIdx = parseInt(slideIdx);

		if (this.slides[slideIdx]) {
			// slide exists, show him with fade animation
			(function(contextJSSlideClass){
				contextJSSlideClass.container.fadeOut(function(){
					contextJSSlideClass.container
						.empty()
						.html(contextJSSlideClass.slides[slideIdx])
						.fadeIn();
				});
			})(this);

			this.currentSlide = slideIdx;
			this.slideIdxInput.val(slideIdx);

			// modify browser url
			if (window.history && history.pushState) {
				history.pushState(null, null, "#slide" + slideIdx)
			}

			// load next slides when come near to the end of slides array
			for (var i = this.currentSlide + 1;
				 i < (this.currentSlide + 1 + WHEN_LOAD_NEW_SLIDES) && i <= this.totalSlides; i++)
			{
				if (this.slides[i] == undefined) {
					// if slide doesn't exist then load whole bunch of slides

					var slidesToLoad = i - this.currentSlide + COUNT_SLIDES_PER_LOAD - 1;

					// slides to load can't exceed total slides count
					if (slidesToLoad > this.totalSlides - this.currentSlide) {
						slidesToLoad = this.totalSlides - this.currentSlide;
					}
					this.loadSlides(slidesToLoad);
					break;
				}
			}
		} else {
			// slide doesn't loaded, load him
			(function(context, slideIdx){
				$.ajax({
					type: "GET",
					url: '/slides/' + slideIdx + '.html',
					dataType: 'html',
					context: context,
					success: function(data) {
						this.slides[slideIdx] = data;
						this.show(slideIdx);
					},
					error: function() {
						alert('Sorry, slide #'+ slideIdx +' not found =(');
					}
				});
			})(this, slideIdx);
		}
	};

	/**
	 * Shows next slide
	 */
	this.next = function() {
		this.show(this.currentSlide + 1);
	};

	/**
	 * Shows previous slide
	 */
	this.prev = function() {
		this.show(this.currentSlide - 1);
	};

	/**
	 * Loads first slide and starts ajax loading of next several slides
	 */
	this.init = function() {
		$.ajax({
			type: "GET",
			url: '/slides/' + FIRST_SLIDE_INDEX + '.html',
			dataType: 'html',
			context: this,
			success: function(data) {
				this.slides[FIRST_SLIDE_INDEX] = data;
				this.show(FIRST_SLIDE_INDEX);
			}
		});
	};
}