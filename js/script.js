(function($) {
	$(function(){
        /**
         * Creates new JSSlide object
         */
		JSSlide = new JSSlideClass({
			totalSlides: 5,
            container: $('.slide'),
            slideIdxInput: $('.controls__slideidx')
		});

        /**
         * Check hash in url for slide, and then show specified slide or show first slide
         */
        hashResult = /slide(\d)+/.exec(window.location.hash);
        if (hashResult && hashResult[1]) {
            JSSlide.show(hashResult[1]);
        } else {
            JSSlide.init();
        }

        /**
         * Load page on press Enter
         */
        $('.controls__slideidx').keypress(function(e) {
            if(e.keyCode == 13) {
                JSSlide.show($(this).val());
            }
        });

        /**
         * Url to next slide
         */
        $('.controls__next').click(function(e){
            e.preventDefault();
            JSSlide.next();
        });

        /**
         * Url to previous slide
         */
        $('.controls__prev').click(function(e){
            e.preventDefault();
            JSSlide.prev();
        });

	});
})(jQuery);