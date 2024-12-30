
function scroll_to(clicked_link, nav_height) {
	var element_class = clicked_link.attr('href').replace('#', '.');
	var scroll_to = 0;
	if(element_class != '.top-content') {
		element_class += '-container';
		scroll_to = $(element_class).offset().top - nav_height;
	}
	if($(window).scrollTop() != scroll_to) {
		$('html, body').stop().animate({scrollTop: scroll_to}, 1000);
	}
}


jQuery(document).ready(function() {
	
	/*
	    Navigation
	*/
	$('a.scroll-link').on('click', function(e) {
		e.preventDefault();
		scroll_to($(this), $('nav').outerHeight());
	});
	// toggle "navbar-no-bg" class
	$('.top-content .text').waypoint(function() {
		$('nav').toggleClass('navbar-no-bg');
	});
	
    /*
        Background slideshow
    */
    $('.top-content').backstretch("assets/img/backgrounds/1.jpg");
    $('.call-to-action-container').backstretch("assets/img/backgrounds/1.jpg");
    $('.testimonials-container').backstretch("assets/img/backgrounds/1.jpg");
    
    $('#top-navbar-1').on('shown.bs.collapse', function(){
    	$('.top-content').backstretch("resize");
    });
    $('#top-navbar-1').on('hidden.bs.collapse', function(){
    	$('.top-content').backstretch("resize");
    });
    
    /*
        Wow
    */
    new WOW().init();
    
    /*
	    Contact form
	*/
	$('.contact-form form input[type="text"], .contact-form form textarea').on('focus', function() {
		$('.contact-form form input[type="text"], .contact-form form textarea').removeClass('input-error');
	});
	$('.contact-form form').submit(function(e) {
		e.preventDefault();
	    $('.contact-form form input[type="text"], .contact-form form textarea').removeClass('input-error');
	    var postdata = $('.contact-form form').serialize();
	    $.ajax({
	        type: 'POST',
	        url: 'assets/contact.php',
	        data: postdata,
	        dataType: 'json',
	        success: function(json) {
	            if(json.emailMessage != '') {
	                $('.contact-form form .contact-email').addClass('input-error');
	            }
	            if(json.subjectMessage != '') {
	                $('.contact-form form .contact-subject').addClass('input-error');
	            }
	            if(json.messageMessage != '') {
	                $('.contact-form form textarea').addClass('input-error');
	            }
	            if(json.emailMessage == '' && json.subjectMessage == '' && json.messageMessage == '') {
	                $('.contact-form form').fadeOut('fast', function() {
	                    $('.contact-form').append('<p>Thanks for contacting us! We will get back to you very soon.</p>');
	                });
	            }
	        }
	    });
	});
	
});


jQuery(window).load(function() {
	
	/*
		Loader
	*/
	$(".loader-img").fadeOut();
	$(".loader").delay(1000).fadeOut("slow");
	
	/*
		Hidden images
	*/
	$(".testimonial-image img").attr("style", "width: auto !important; height: auto !important;");
	
});



/*
		contact
	*/


	var validate = function(e) {
		var fields = document.querySelectorAll('.contact-form textarea, .contact-form input[type="text"]');
		var regEx;
		var removeSpan;
		var par;
		var check = false;
		var val;
		var errArr = [];
	
		for (var i = 0; i < fields.length; i++) {
			if (fields[i].value === "") {
			  
				if (fields[i].nextElementSibling.classList.contains('error')) {
				  removeSpan = fields[i].nextElementSibling;
				  par = fields[i].parentNode;
				  par.removeChild(removeSpan);
				  fields[i].nextElementSibling.innerHTML = "Hmmm! " + fields[i].placeholder + " is required?";
				  fields[i].style.boxShadow = "0 0 2px 1px #cc0001";
				  check = false;
				  errArr.push(fields[i]);
				}
				fields[i].nextElementSibling.innerHTML = "Hmmm! " + fields[i].placeholder + " is required?";
				fields[i].style.boxShadow = "0 0 2px 1px #cc0001";
				check = false;
				errArr.push(fields[i]);
			} else {
	
				// check if message and name values contain valid characters.
				if (fields[i].id !== 'email' && fields[i].id !== 'phone') {
					val = isValidChar(fields[i]);
					if(val === false) {
					  fields[i].nextElementSibling.innerHTML = "Are you trying to HACK ME!";
					  fields[i].style.boxShadow = "0 0 2px 1px #cc0001";
					  check = false;
					  errArr.push(fields[i]);
					} else {
					  fields[i].nextElementSibling.innerHTML = "";
					  fields[i].style.boxShadow = "none";
					  check = true;
					}
				}
			  
				if(fields[i].id === 'phone') {
				  val = isValidPhone(fields[i]);
				  if(val === false) {
					fields[i].nextElementSibling.innerHTML = "Hmmm! Your phone number is not valid?";
					fields[i].style.boxShadow = "0 0 2px 1px #cc0001";
					check = false;
					errArr.push(fields[i]);
				  } else {
					fields[i].nextElementSibling.innerHTML = "";
					fields[i].style.boxShadow = "none";
					check = true;  
				  }
				}
	
				if (fields[i].id === 'email') {
					val = isValidEmail(fields[i]);
					if(val === false) {
						fields[i].nextElementSibling.innerHTML = "Hmmm! Your email address is not valid?";
						fields[i].style.boxShadow = "0 0 2px 1px #cc0001";
						check = false;
						errArr.push(fields[i]);
					} else {
						fields[i].nextElementSibling.innerHTML = "";
						fields[i].style.boxShadow = "none";
						check = true;
					}
				}
			}
		}
	  
		if(check === false) {
		  var count = 0;
		  var toErr = setInterval(function() {
			var e = errArr[0].offsetTop + -25;
			var pos = Math.abs(e);
			if(count < pos) {
			  count ++;
			  window.scrollTo(0, count);
			} else {
			  clearInterval(toErr);
			}
		  }, 1);
		}
		
		return check
	
		// Helper functions.
		function isValidEmail(e) {
			regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			var email = e.value;
			if (!regEx.test(email)) {
				return false;
			}
		}
	
		function isValidChar(e) {
			regEx = /^[a-zA-Z@#$%!?^&*()_+\-=\[\]{};':"\\|,.\/? ]*$/;
			var value = e.value;
			if (!regEx.test(value)) {
				return false;
			}
		}
	  
		function isValidPhone(e) {
		  regEx = /^[+]?[(]?[+]?\d{2,4}[)]?[-\s]?\d{2,8}[-\s]?\d{2,8}$/;
		  var value = e.value;
		  if(!regEx.test(value)) {
			return false;
		  }
		}
	};

