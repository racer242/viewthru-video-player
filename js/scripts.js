$(function() {
	$('.open_menu').click(function(){

			$('.head .menu').toggleClass('active')
			$('header .login').removeClass('active')
			$('.login > .link').text('Login')
			$('.block-login > form').hide()
			$('.block-login > form.form-login').show()

	})
	$('header .login > .link').click(function() {
		$('header .login').toggleClass('active')
		$('.head .menu').removeClass('active')
		if(!$('header .login').hasClass('active')) {
			$('.login > .link').text('Login')
			$('.block-login > form').hide()
			$('.block-login > form.form-login').show()
		}
	})
	$('.link-form').click(function(e){
		e.preventDefault();
		var form = $(this).data('form');
		if(form == 'form-reg') {
			if ($(window).width() > 575) {
				$('.login > .link').text('Registration')
			}
		} else {
			$('.login > .link').text('Login')
		}
		$('.block-login > form').hide()
		$('.block-login > form.'+form).show()

	})

	if($('.table.sort').length){
		var headers = $('.sort thead th');
	    $(headers[0]).attr('data-tablesort-type', 'date');
	    $('table').not(".tablesort").addClass('tablesort');
	}

	var carousel = document.getElementsByClassName('carousel');
    for (let i=0; i<carousel.length; i++) {
	    if(carousel[i].className == 'carousel') {
	        setMouseOver(carousel[i])
	    }
    }
    function setMouseOver(element) {

        element.onmousemove = function(e) {
            var imgs = this.getElementsByTagName("li");
            var rect = e.target.getBoundingClientRect();
            //var imgs_count = this.getElementsByClassName("imagecount");
            // imgs_count = $(this).find('.imagecount')
            var x = Math.round(e.clientX - rect.left);
            var y = 0;
            var w = rect.width;
            var part = w/imgs.length;
            var part_slide = Math.floor(x/part);
            $(this).carousel(part_slide);
            part_slide = part_slide + 1;
            // imgs_count.html(part_slide.toString() + "/" + imgs.length.toString());
            // setting first img for display
            $(this).attr("data-first", part_slide);
						$(this).parent().attr("data-first", part_slide-1);
        }
    }
    if($('.video_pop').length || $('.pop_open').length) {
	    $('.video_pop').fancybox({
			btnTpl: {
				smallBtn:
			      '<button type="button" data-fancybox-close class="close_pop" >' +
			      '<img src="images/close.png" />' +
			      '</button>'
			}
		});
	    $('.pop_open').fancybox({
	    	btnTpl: {
				smallBtn:
			      '<button type="button" data-fancybox-close class="close_pop" >' +
			      '<img src="images/close.png" />' +
			      '</button>'
			}
	    });
	}
	if($('.drop-upload-progress').length) {
		function progressView(){
		    let diagramBox = document.querySelectorAll('.drop-upload-progress .status .circle');
		    diagramBox.forEach((box) => {
		        let deg = (360 * box.dataset.percent / 100) + 180;
		        if(box.dataset.percent >= 50){
		            box.classList.add('over_50');
		        }else{
		            box.classList.remove('over_50');
		        }
		        box.querySelector('.piece.right').style.transform = 'rotate('+deg+'deg)';
		    });
		}
		progressView();
	}
})
