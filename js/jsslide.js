/**
 * Slide class
 */
function JSSlideClass(options) {
    /**
     * Constant. Count slides per each loading
     */
    var COUNT_SLIDES_PER_LOAD = 2;

    /**
     * Constant that defines index of first slide. Usually equals 1
     */
    var FIST_SLIDE_INDEX = 1;

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
                $.ajax({
                    type: "GET",
                    url: '/slides/' + i + '.html',
                    dataType: 'html',
                    context: context,
                    success: function(data) {
                        this.slides[i] = data;
                    }
                });
            })(this, i);
		}
	};

    /**
     * Loads and show slide in slide window and load next and previous slides
     * @param slideIdx index of slide to show
     * @param loadSiblings boolean Flag, used to load next and previous slides
     */
    this.show = function(slideIdx, loadSiblings) {

        // default value
        if (loadSiblings == undefined) {
            loadSiblings = true;
        }

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
            url: '/slides/' + FIST_SLIDE_INDEX + '.html',
            dataType: 'html',
            context: this,
            success: function(data) {
                this.slides[FIST_SLIDE_INDEX] = data;
                this.show(FIST_SLIDE_INDEX);
                this.loadSlides(COUNT_SLIDES_PER_LOAD);
            }
        });
    };
}