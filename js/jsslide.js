/**
 * Slide class
 */
function JSSlideClass(options) {
	/**
	 * Total count of slides
	 */
	this.totalSlides = options.totalSlides;

	/**
	 * Index of the current slide
	 */
	this.currentSlide = 1;

	/**
	 * Array with slides html
	 */
	this.slides = [];

	/**
	 * Loads more slides via ajax
	 * @param countSlides count of slides to download
	 */
	this.loadSlides = function (countSlides) {
		// default value
		countSlides = countSlides || 1;

		for (var i = this.currentSlide + 1; i <= (this.currentSlide + countSlides); i++) {
			$.ajax({
				type: "GET",
				url: '/slides/' + i + '.html',
				dataType: 'html',
				context: this,
				success: function(data) {
					this.slides.push(data);
				}
			});
		}
	};
}