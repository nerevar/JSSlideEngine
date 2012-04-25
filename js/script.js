(function($) {
	$(function(){

		JSSlide = new JSSlideClass({
			totalSlides: 5,
            container: $('.slide'),
            slideIdxInput: $('.controls__slideidx')
		});

		JSSlide.init();


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


	})
})(jQuery);