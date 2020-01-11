// $(document).ready( function() {

	$('#phone').mask('+99 (999) 99-99-999');




/*Выбрать вход или регистация*/
	$('.choiceOption').on('click', function(event) {
		let activated = event.target.attributes['id'].value;
		$('.choiceOption').removeClass('activeOption');
		$('form').removeClass('activeForm');
		$( this ).addClass('activeOption');
		$(`form[name=${activated}]`).addClass('activeForm');
	});

/*Проверка валидности поля по нажатию клавиши*/
	$('#signIN .wrap input:not([type=submit])').on('keyup', function(event) {
		validateInput(this);

		if ( checkInput() ) {
			$('#signIN input[type=submit]').removeAttr('disabled');
		};
	});

/*Добавляет удаляет класы valid  and invalid, сообщение об ошибке*/
	function validateInput(obj) {
		// if ( obj.validity.valid ){
		// 	$(obj).removeClass('invalid');
		// 	$(obj).addClass('valid');
		// 	$(obj).next(".error").text('');
		// } else {
		// 	$(obj).removeClass('valid');
		// 	$(obj).next(".error").text('Input Error');
		// 	$(obj).addClass('invalid');
		// } 
		/*РАБОТАЕТ без регулярных выражений, проходит валидацию
		по атрибуту pattern в html */

		
		let value = $(obj).val();
		let regexp;
		let id = $(obj).attr('name');
		switch(id) {
			case 'firstName':
			case "lastName":
				regexp = /[A-Z]{1}['a-z]+([A-Z]{1}['a-z])?/;
				break;
			case 'nikName':
				regexp = /[A-Za-z]+[-\w/.']+/;
				break;
			case 'phone':
				regexp = /\+[\d]{2}\s\([\d]{3}\)\s[\d]{2}-[\d]{2}-[\d]{3}/;
				break;
			case 'eMail':
				regexp = /\w[-\w\.]+\@([-\w]+\.)+[a-z]+/i;
				break;
			case 'password':
			case 'confirmPassword':
				regexp = /[-\w]{8}/;
				break;
		};

		if (regexp.test(value)) {
			$(obj).removeClass('invalid');
			$(obj).addClass('valid');
			$(obj).next(".error").text('');
		} else {
			$(obj).removeClass('valid');
			$(obj).next(".error").text('Input Error');
			$(obj).addClass('invalid');
		};

	};

	function checkConfirmPassword() {
		let pass = $('#signIN input[name=password]');
		let confPass = $('#signIN input[name=confirmPassword]');
		if (pass === confPass) {
			return true;
		} else {
			return false;
		}
	};

/*Проверка всех полей на наличие класов valid, invalid*/
	function checkInput() {
		$('#signIN input:not([type=submit])')
			.each( function() {
				if ( $(this).hasClass('invalid') ){
					return false;
				}
			});
		return true;
	};


/*Отправка формы по нажатию кнопки, после проверки всех полей на валидность
открывает окно верификации по коду*/
	$('#signIN .wrap input[type=submit]').on('click', function(event) {
		$('.activeForm input:not([type=submit])').each( function(key) {
			validateInput(this);
		} );

		if ($('.activeForm').attr('name') === 'registration' ) {
			if ( !checkConfirmPassword() ) {
				$('#signIN input[name=confirmPassword]').addClass('invalid');
				$('#signIN input[name=confirmPassword]').next(".error").text('Password not verified');
				event.preventDefault();
				return;
			} 
		}

		if ( checkInput() ) {
					event.preventDefault();
					$('#signIN .wrap').fadeOut(500);
					$('#verification').fadeIn(500);
					$(`#verification input[tabindex='1'`).focus();
				}

	});

/*Передача фокуса в окне верификации по коду
и активация кнопки Submit*/
	$('#verification form .field input').on('keydown', function(event) {
		setTimeout( () => {
			let tabindex = $(this).attr('tabindex');
			$(this).blur();
			$(`#verification form input[tabindex = ${++tabindex}]`).focus();
		}, 100);
		
	});

	$('#verification form input[type=submit]').on('click', function(event) {
		$('#signIN').slideUp(1000);
		event.preventDefault();
	});

	

	/*ПЕреключение вкладок внутри открытого муню*/
	let blocks = $('.block');
	let navLinks = $('#nav li > a');

	collapseBlock();

	//Показывает все блоки, задает их размеры, задний фон и позицию
	function collapseBlock() {
		blocks.each( function(key) {
			let width = 70 + key * 3;
			let left = (100 - width) / 2;
			let bgColor = 119 + key * 17;
			let top = 50 * key;

			$(this).css('width', `${width}%`)
					.css('background-color', `rgb(${bgColor}, ${bgColor}, ${bgColor}`)
					.css('position', "absolute")
					.css('top', `${top}px`)
					.css('left', `${left}%`)
					.css('height', '150px');
				} );
		positionBlock();

		blockClick();

		$('footer').css('position', 'fixed')
		.css('bottom', '0');
	};

	

/////Увеличивает для предпросмотра выбранный блок по ссылке в Nav

	$('#nav li > a').on('click', function(event) {
		let navId = event.target.attributes['id'].value;
		let id = navId.slice(3);
		showBlock(id);
		console.log(this);
		navLinks.removeClass('activeLink');
		$(this).addClass('activeLink');
		return false;
	} );

/////////////////////
/*Увеличивает для предпросмотра выбранный блок при нажатии
		 на сам блок (при открытом Nav)*/

		 function blockClick() {
		 	blocks.on('click', function(event) {
		 		let blId = event.target.attributes['id'].value;
		 		let id = blId.slice(5);
		 		showBlock(id);
				// positionBlock();
		 	});
		 };

//////////////
/*Задает выбранному блоку класс Active, и удаляет этот 
		класс у других блоков*/
	function showBlock(id) {
		blocks.removeClass('active');
		$(`#block${id}`).addClass('active');
		positionBlock();

	};

////////////////////
/*Задает позиционирование блоков при открытом Nav, 
		с учетом наличия класса Active*/
	function positionBlock() {
		let smallBlock = false;
		blocks.each( function(key){

			if( $(this).hasClass("active") ){
				smallBlock = true;
				$(this).css('top', `${50 * key}px`)
						.css('height', '600px');
			} else {
				if (smallBlock) {
					$(this).css('top', `${50 * key + 500}px`)
							.css('height', '150px');
				} else {
					$(this).css('top', `${50 * key}px`)
							.css('height', '150px');
				}
			}
		} );
	};

////////////////////////////////////////////////////////////////

	let toggleMenu = $('#toggleMenu');
	let nav = $('#nav');
	
	let bgColorBody = '#E7E9ED';

/*Переключает видимость Nav,
Разворачивает и сворачивает активный блок (с классом Active))*/
	toggleMenu.on('click', function() {

		nav.slideToggle(1500);
		let bgColorActive = $('.active').css('background-color');
		if ( $('#openMenu').css('display') === 'none' ) {
			$('#closeMenu').fadeToggle(1000);
			$('body').css('background-color', bgColorActive);
			$('#openMenu').delay(1000).fadeToggle(1000);

			$('.block').fadeOut(200);
			blocks.off('click');
			$('.active').fadeIn(100)
							.css('position', 'relative')
							.css('width', '100%')
							.css('height', 'auto')
							.css('margin', '0')
							.css('top', '0')
							.css('left', '0')
							.css('transition-property', 'all')
							.css('transition-duration', '1500ms');
			$('footer').css('position', 'statick');

		} else {
			$('#openMenu').fadeToggle(1000);
			$('body').css('background-color', bgColorBody);
			$('#closeMenu').delay(1000).fadeToggle(1000);
			$('.block').fadeIn(200);
			blockClick();
			collapseBlock();
		}
	});

/////////////////////////////////////////////////////

	let os = $('#os');
	let down = $('#down');

/*Выдвинуть окно загрузки при наведении на него курсора мыши*/
	$('#download-progress').on("mouseenter", function() {
		$('#download-progress').css('right', "100px")
										.css('transition-property', 'all')
										.css('transition-duration', '800ms');
	});


/////////////////////////////////////////////////////
/*Задвинуть окно загрузки при отведении от него курсора мыши*/
	$('#download-progress').on("mouseleave", function() {
		$('#download-progress').css('right', "-630px")
										.css('transition-property', 'all')
										.css('transition-duration', '800ms');
	});

/////////////////////////////////////////////////////////
	/*Выделение ссылки при наведении на нее курсора мыши*/
	$('#nav li > a').on('mouseover', function(event) {
		// console.log(event);
		let source = event.target.attributes["id"].value;
		
		$("#" + source + " > div").css("width", `100%`)
									.css("transition-property", 'width')
									.css("transition-duration", '400ms')
	});

	/*Снятие Выделения с ссылки при отведении от нее курсора мыши*/
	$('#nav li a').on('mouseout', function(event) {
		let source = event.target.attributes["id"].value;
		// console.log(source);
		$("#" + source + " > div").css("width", '0%')
									.css("transition-property", 'width')
									.css("transition-duration", '400ms')
	});


	////////////////////////////////////////////////////////////
	/*Переключает видимость блока выбора операционных систем*/
	down.on('click', function() {
		// os.slideDown(500);
		os.slideToggle(500);
	});

	/*Задает выбранную операционную систему
	 и скрывает блок выбора операционных систем*/
	$('#os img').on('click', function(event) {
		console.log(event);
		let source = event.target.attributes['src'].value;
		$('#os_download').attr('src', source);
		os.slideUp(500);
	});



// });