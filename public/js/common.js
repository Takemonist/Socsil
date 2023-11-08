//var
const $w = $(window);
const $wrapper = $('#wrapper');
$(function(){
//function
	/*.hoverを追加する関数*/
	function addHover(element) {
		element.on('touchstart mouseenter', function(){
		  $(this).addClass( 'hover' );
		}).on('touchend mouseleave click', function(){
		  $(this).removeClass( 'hover' );
		});
	}
	/*
		hoverArr = [] の [] に.hoverをつけたい要素を$('.aaa')の形でいれてください
	*/
	var hoverArr = [ $('a'),$('.header_content ._hus_sub') ]
	for ( var i=0; i < hoverArr.length; i++ ) {
		addHover(hoverArr[i]);
	}

// Android判別
if (navigator.userAgent.indexOf('Android') > 0) { 
let body = document.getElementsByTagName('body')[0]; 
body.classList.add('Android'); 
}

//effects
	//固定ヘッダーがある場合のページ内アンカー
	//a[href^="#"]:not(".bbb")と書けば.bbbのクラスを持つものは除外されます。
	$(document).on('click', 'a[href^="#"]',function(){
        var $this = $(this);
        var target = $($this.attr('href')).offset().top;
    	if ( window.innerWidth <= 768 ) {
    		$('html,body').animate({ scrollTop:target - 80 },400);
    	} else {
			$('html,body').animate({ scrollTop:target - 120 },400);
    	}
        return false;
    });
    //固定ヘッダーがある場合のページ内アンカー（ロード時）
    $(window).on('load',function(){
		if ( location.hash ) {
			var hashTarget = location.hash;
			var target = $(hashTarget).offset().top;
			if ( window.innerWidth <= 768 ) {
				$('html,body').animate({ scrollTop: target - 80 },100);
			} else {
				$('html,body').animate({ scrollTop: target - 120 },100);
			}
		}
		return false;
	});

    // all_fixed_nav
    if ( $('.all_fixed_nav').length ) {
	    $('.all_fixed_nav ._top_tab').on('click',function(){
			var $this = $(this);
			if($('.all_fixed_nav').hasClass('on')) {
				$('.all_fixed_nav').removeClass('on');
			} else {
				$('.all_fixed_nav').addClass('on');
			}
			return false;
		});
		var navScroll = new PerfectScrollbar('.all_fixed_nav ._content');

		$('.all_fixed_nav_bg').on('click',function(){
			$('.all_fixed_nav').removeClass('on');
			return false;
		});
	}
	if ( $('.all_sub_table').length ) {
		$('.all_sub_table th').each(function(i){
			var $this = $(this);
			var th = $this.text();
			if(th == '土') {
				$this.css('color','#0057B0')
			}
			if(th == '日' || th == '祝' || th == '日祝') {
				$this.css('color','#D30000')
			}
		});
		$('.all_sub_table td').each(function(i){
			var $this = $(this);
			var text = $this.text();
			if(text.match(/⚪︎/)) {
				$this.addClass('open');
				let ret = text.replace("⚪︎", "");
				$this.text(ret)
			}
			if(text.match(/-/)) {
				$this.addClass('recess')
			}
		});
	}

	// all_sub_side_nav
	if ( $('.all_2col_side_nav._has_current').length ) {
		var wH = $w.innerHeight();
		const $nav = $('.all_2col_side_nav ._list');
		const $navLi = $('.all_2col_side_nav ._list > li');
		const $navLink = $('.all_2col_side_nav ._list > li > a');
		const $navSubLink = $('.all_2col_side_nav ._sub_list > li > a');
		if($w.innerWidth()>1024) {
			$navLi.each(function(i){
				$(this).on('touchstart mouseenter', function(){
				  $(this).find('._sub_list').stop().slideDown();
				}).on('touchend mouseleave click', function(){
				  $(this).find('._sub_list').stop().slideUp();
				});
			});
		}
		$w.on('load scroll', function(){
			var winSc = $w.scrollTop();
	    	$navLink.each(function(i){
	    		var $this = $(this);
	    		var $target = $($this.attr('href'));
	    		var target = $target.offset().top - wH * 0.5;
				var targetHeight = $target.outerHeight();
	    		if ( i == 0 ) {
	    			if ( winSc > 0 && winSc < target + $target.outerHeight() + 100) {
	    				$navLink.removeClass('current')
	    				$this.addClass('current')
	    			}
	    		} else {
	    			if ( winSc > target && winSc < target + $target.outerHeight() ) {
	    				$navLink.removeClass('current')
	    				$this.addClass('current')
	    			}
	    		}
		    	// 緑の領域にいる間は白文字
		    	if ( $('.all_sub_green_sec').length ) {
		    		var $greenSec = $('.all_sub_green_sec');
			    	$greenSec.each(function(i){
			    		var $greenThis = $(this);
			    		var greenStart = $greenThis.offset().top;
			    		var greenEnd = $greenThis.offset().top + $greenThis.innerHeight();
			    		var scrollTarget = $this.offset().top ;
			    		if (!(scrollTarget > greenStart && scrollTarget < greenEnd)) {
			    			$nav.removeClass('white');
			    		} else {
			    			$nav.addClass('white');
			    		}
			    	});
			    }
	    	});
		});
	}

	// .all_sp_menu
	if ( $('.all_sp_menu').length ) {
		var $target = $('#wrapper');
		var _class = 'sp_menu_active';
		$w.on('load', function(){
			$('.all_sp_menu .all_sp_menu_btn ._btn').on('click',function(){
				$('#wrapper').toggleClass('sp_menu_active');
				console.log('test');
				return false;
			});

			$('.all_sp_menu_list a').on('click',function(){
				if($('#wrapper').hasClass('sp_menu_active')) {
					setTimeout(function(){
						$('#wrapper').removeClass(_class);
						return false;
					},450);
				}
			});
		});
	}
	// all_swipe_item
	function spSwipe(elem,swipePoint = 768) {
		elem.addClass('all_swipe_item')
		$w.on('load resize',function(){
			var wW = $w.innerWidth();
			if( wW <= swipePoint) {
				elem.addClass('swipe_active');
			} else {
				elem.removeClass('swipe_active');
			}
		});
		$w.on('load scroll',function(){
			if (elem.hasClass('swipe_active')) {
				if ( $w.scrollTop() > elem.offset().top - $w.height() + 100 ) {
					elem.addClass('on');
					setTimeout(function(){
						elem.addClass('none');
					},2600)
				} else {
						elem.removeClass('on none');
				}
			}
		});
	}
	spSwipe($('.all_swipe_item'))

	// modal
	var wW = $w.innerWidth();
	$w.on('load', function(){
		$('.all_modal_button').on('click',function(){
			var $this = $(this);
			var modal = $this.attr('data-modal');
			console.log(modal);
			// $('.all_modal').addClass('active');
			$('#'+modal).addClass('active').fadeIn(400);

			if ($('.all_fixed_nav').hasClass('on')) {
				$('.all_fixed_nav').removeClass('on')
			}
			if(wW<=786) {
		        $('html').css('overflow','hidden').on('touchmove.noScroll', function(e) {
		            e.preventDefault();
		        });
			}
			$('.all_modal ._bg, .all_modal ._close_btn').on('click',function(){
				var $target = $(this).closest('.all_modal');
				$target.fadeOut(400)
				$('.all_modal').removeClass('active');
				// $('.all_modal_item').removeClass('active');
				if(wW<=786) {
			        $('html').css('overflow','').off('.noScroll');
					return false;
				}
			});
			return false;
		});
	});

//header
if ( $('#header').length ) {
	var $header = $('#header');
	$('.header_ham').on('click',function(){
		if ( $('#header').hasClass('_open') ) {
			$('#header').removeClass('_open');
			$('.header_ham ._text').text('メニュー');
		} else {
			$('#header').addClass('_open');
			$('.header_ham ._text').text('閉じる');
		}
	});
	$('#header ._plus').on('click',function(){
		var $this = $(this);
		var $target = $this.closest('._hus_sub').find('._sub_sec');
		if ( $this.hasClass('_sub_open') ) {
			$target.slideUp(400);
			$this.removeClass('_sub_open')
		} else {
			$target.slideDown(400);
			$this.addClass('_sub_open')
		}
	});
	$w.on('load scroll',function(){
		var winSc =  $w.scrollTop();
		if ( winSc > 50 ) {
			$header.addClass('_scroll')
		} else {
			$header.removeClass('_scroll')
		}
	});
	$('.header_content ._sub_list li a').on('click',function(){
		var $this = $(this);
		$header.removeClass('_open');
	});
}

	var footerOff = $('#footer').offset().top - $w.innerHeight();
	$w.on('load scroll',function(){
		var winSc =  $w.scrollTop();
		if ( winSc > footerOff ) {
			$wrapper.addClass('on_footer')
		} else {
			$wrapper.removeClass('on_footer')
		}
	});
	// ページネーション
	if ( $('.all_pagination').length ) {
		if ( $('ul.page-numbers .prev').length ) {
			var urlPrev = $('ul.page-numbers .prev').attr('href');
			$('.all_pagination ._prev a').addClass('active').attr('href',urlPrev);

		}
		if ( $('ul.page-numbers .next').length ) {
			var urlNext = $('ul.page-numbers .next').attr('href');
			$('.all_pagination ._next a').addClass('active').attr('href',urlNext);
		}
	}

	// matchHeight
	$('.all_grid_sec ._item_title').matchHeight();
	$('.all_grid_sec .all_text').matchHeight();

	/* Toggle PDF
	---------------------------------------- */
	 var speed = 300;
    if ($('.js-toggle-label').length > 0) {
        var $toggle_btn = $('.js-toggle-label'),
            $toggle_con = $('.js-toggle-content'),
            class_active = 'is-active';

        $toggle_btn.on('click', function () {
            $(this).toggleClass(class_active);
            $(this).next('.js-toggle-content').slideToggle(speed);
        });
    }

    if ( $('.rights').length ) {
		$w.on('load', function(){
			if ( location.hash.match(/sec_records/) ) {
				$('#sec_records').trigger('click');
				var target2 = $('.all_sub_shadow_box').offset().top;
		    	
			}
    	});
	}

	// 募集要項印刷用
	$(function(){
		//印刷ボタンをクリックした時の処理
		$w.on('load', function(){
			$('.print-btn').on('click', function(){
				var flag = 0;
				var $this = $(this);
				//プリントしたいエリアの取得
				var $printArea = $this.closest('.all_modal_item');

				//プリント用の要素「#print」を作成し、上で取得したprintAreaをその子要素に入れる。
				$('body').append('<div id="print" class="printBc sub_recruit"></div>');
				$printArea.clone().appendTo('#print');

				//プリントしたいエリア意外に、非表示のcssが付与されたclassを追加
				$('body > :not(#print)').addClass('print-off');

				window.print();

				// // //window.print()を実行した後、作成した「#print」と、非表示用のclass「print-off」を削除

			    if(flag == 1) {
				    $('#print').remove();
					$('.print-off').removeClass('print-off');
			    }
			    flag = 1;
				

				// $.when(
				//     //処理A
				//     window.print()
				// ).done(function(){
				//     //処理B
				//     if(flag == 1) {
				// 	    $('#print').remove();
				// 		$('.print-off').removeClass('print-off');
				//     }
				//     flag = 1;

				// ;});
			});
		});
	});

	$('.all_grid_sec ._item ._img').on('click',function(){
		var $this = $(this);
		var $thisLink = $this.siblings('.all_more_button').find('a');
		if($thisLink.length) {
			console.log('test');
			window.location.href = $thisLink.attr('href');
		}
		// return false;
	});

	
	// .all_accordion
    if ( $('.all_accordion_item').length ) {
        $('.all_accordion_item').each(function(i){
            var accSlider;
            var $this = $(this);
            var $accHead = $this.find('._head');
            var $accBody = $this.find('._body');
            $accHead.on('click',function(){
                if ($this.hasClass('open')) {
                    $this.removeClass('open');
                    $accBody.stop().slideUp();
                } else {
                    $this.addClass('open');
                    $accBody.stop().slideDown();
                }
            });
        });
    }
});

// top
if ( document.getElementsByClassName('top')[0] != null ) {
	document.addEventListener( 'DOMContentLoaded', function() {
	    var top_mv_slider = new Splide( '#top_mv_slider', {
	    	type   : 'fade',
	    	rewind: true,
	    	speed: number = 2000,
	    	arrows: boolean = false,
	    	drag:false,
	    	autoplay:true,
	    	interval: number = 5000,
	    	pauseOnHover: boolean = false,
	    	pagination: boolean = false,
	    }
	    ).mount();

	    var top_news_slider = new Splide( '#top_news_slide', {
	    	type   : 'loop',
	    	// rewind: true,
	    	speed: number = 800,
	    	arrows: boolean = false,
	    	drag:true,
	    	autoplay:true,
	    	interval: number = 3000,
	    	pauseOnHover: boolean = false,
	    	pauseOnFocus: boolean = false,
	    	// pagination: boolean = false,
	    }
	    ).mount();
	});
	$(function(){
		$w.on('load', function(){
			$('.top_mv_slider').addClass('active');
		});

		$w.on('load scroll', function(){
			var winSc = $w.scrollTop();
			if(winSc <= 100){
				$('.all_fixed_nav').addClass('top_scroll')
			} else {
				$('.all_fixed_nav').removeClass('top_scroll')
				// $('.all_fixed_nav').removeClass('on')
			}
		});
	});
}


$(function(){
  //クリックで動く
  $('.draw_tab').click(function(){
    $(this).toggleClass('active');
    $(this).next('.drawer_sp').slideToggle();
  });
});
if ( $('.pamphlet').length ) {
	$w.on('load', function(){
	    if(window.matchMedia('(max-width:1024px)').matches) {
        // SPのときの動き
	    } else {
	        // PCのときの動き
		    $('.draw_tab').addClass('active');
		    $('.draw_tab').next('.drawer_sp').slideDown();
	    }
	});
}
if ( $('.nurse_slider').length ) {

	// nurseスライダー
	var nurseSlider = new Swiper('.nurse_slider', {
	    // テンプレ
	    speed: 500,
	    slidesPerView: 'auto',
	    spaceBetween: 15,
	    // レスポンシブ
	    breakpoints: {
	        769: {
	            spaceBetween: 60,
	        }
	    },
	    scrollbar: {
	        el: '.nurse_imgs .all_slider_control ._scrollbar',
	        draggable: true,
	    },
	    // ナビゲーション
	    navigation: {
	        prevEl: '.nurse_imgs .all_slider_control ._prev',
	        nextEl: '.nurse_imgs .all_slider_control ._next',
	    },
	    watchOverflow: true,
	});

}

if ($(".facility_slider").length) {
    var nurseSlider = new Swiper('.facility_slider', {
        // テンプレ
        speed: 500,
        slidesPerView: 'auto',
        spaceBetween: 15,
        // レスポンシブ
        breakpoints: {
            769: {
                spaceBetween: 60,
            }
        },
        scrollbar: {
            el: '.facility_introduction .all_slider_control ._scrollbar',
            draggable: true,
        },
        // ナビゲーション
        navigation: {
            prevEl: '.facility_introduction .all_slider_control ._prev',
            nextEl: '.facility_introduction .all_slider_control ._next',
        },
        watchOverflow: true,
    });
}
$(".nav_tabs .nav_tabs_item ").click(function(){
    const tabIndex = $(this).index();
    const tabs = $(this).closest('.nav_tabs');
    const panels = $(tabs).next('.nav_tabs_panels');
    const panelActive = $(panels).find(`.nav_tabs_panel`).eq(tabIndex);
    $(this).addClass('js-active');
    tabs.find('.nav_tabs_item').not($(this)).removeClass('js-active')
    panels.find('.nav_tabs_panel').not($(panelActive)).removeClass('js-active');
    $(panelActive).addClass('js-active');
})
$(".zip01").keyup(function () {
    AjaxZip3.zip2addr(this, '', 'pref01', 'addr01');
});
// top_information
// カテゴリータブ切り替え
const top_information_nav = '._nurse_blog_news_main .inner_side_sec .inner_side_nav_item .drawer_sp li button';
const top_information_content = '.top_information_item';

$(top_information_nav).on('click', function(e){
	e.preventDefault();
	$(top_information_nav).removeClass('current');
	$(this).addClass('current');

	let this_current_term_id = $(this).attr('data-term-id');

	$(top_information_content).hide();
	$(top_information_content+'[data-term-id='+this_current_term_id+']').fadeIn();
	// ScrollTrigger.refresh();
})