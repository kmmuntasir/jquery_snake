$(document).ready(function() {
	var point = 0;
	var speed_arr = [0, 290, 260, 230, 200, 170, 140, 110, 80, 50, 20];
	var intrvl = $('#speed').val();
	intrvl = speed_arr[intrvl];
	var is_game_over = true;
	var opposite_direction_allowed = false; // Snake can go in opposite direction
	var n = 50;
	var snake_length = 5;
	var snake_x = new Array();
	var snake_y = new Array();
	var main_interval = null;
	/**********************/

	var direction_x = [0, 1, 0, -1];
	var direction_y = [1, 0, -1, 0];
	var current_dir = 1;
	/*
	Up    = 0
	Right = 1
	Down  = 2
	Left  = 3

	/**********************/
	// Game Process Starts Here

	init();
	draw_snake();
	food();
	

	$(document).keydown(function(e) {
		// console.log(e.which);
		if (e.which == 37 || e.which == 65) // left
			current_dir = (opposite_direction_allowed) ? 3 : ((current_dir != 1) ? 3 : current_dir);
		else if (e.which == 38 || e.which == 87) // up
			current_dir = (opposite_direction_allowed) ? 0 : ((current_dir != 2) ? 0 : current_dir);
		else if (e.which == 39 || e.which == 68) // right
			current_dir = (opposite_direction_allowed) ? 1 : ((current_dir != 3) ? 1 : current_dir);
		else if (e.which == 40 || e.which == 83) // down
			current_dir = (opposite_direction_allowed) ? 2 : ((current_dir != 0) ? 2 : current_dir);
		else if (e.which == 27) { // escape
			is_game_over = true; 
			return;
		}
		else if (e.which == 17) { // ctrl
			restart_game();
			return;
		}
		else if (e.which == 32) { // space
			$('#opposite_direction_allowed').click();
			return;
		}
		else if (e.which == 74) { // J
			decrease_speed();
			return;
		}
		else if (e.which == 75) { // K
			increase_speed();
			return;
		}
		else return; // exit this handler for other keys

		if(is_game_over) {
			restart_interval();
			is_game_over = false; 
		}
		e.preventDefault(); // prevent the default action (scroll / move caret)
	});


	/***************** Functions ******************/

	function move() {
		var id = '#pos' + (snake_x[0]+direction_x[current_dir]) + '_' + (snake_y[0]+direction_y[current_dir]);
		var ret = $(id).hasClass('food');
		if(ret) { // Head's new position contains food
			snake_length++;
		snake_x.push(snake_x[snake_length-1]);
		snake_y.push(snake_y[snake_length-1]);
		for(var i=snake_length-1; i>0; i--) {
			snake_x[i] = snake_x[i-1];
			snake_y[i] = snake_y[i-1];
		}
		snake_x[0] += direction_x[current_dir];
		snake_y[0] += direction_y[current_dir];
		food();
		point++;
		$('#value').html('<h2>Total Point: ' + point + '</h2>');
	}
		else { // No food
			for(var i=snake_length; i>0; i--) {
				snake_x[i] = snake_x[i-1];
				snake_y[i] = snake_y[i-1];
			}
			snake_x[0] += direction_x[current_dir];
			snake_y[0] += direction_y[current_dir];
		}
	}

	function init() {
		var content = "";
		for(var i=0; i>(-n); i--) {
			for(var j=0; j<n; j++) {
				content = content + '<div id="pos'+j+'_'+i+'" x="'+j+'" y="'+i+'" class="cell"></div>';
			}
		}
		content = content + '<div class="clear"></div>';
		$('.field').html(content);
		for(var i=snake_length-1; i>=0; i--) {
			snake_x.push(i);
			snake_y.push(0);
		}
		$('#value').html('<h2>Total Point: ' + point + '</h2>');
	}

	function draw_snake() {
		if(validate_position()) {
			$('.cell').removeClass('green');
			$('.cell').removeClass('red');
			$('.cell').removeClass('head');
			var str = '';
			for(var j=0; j<snake_length; j++) {
				id = '#pos' + snake_x[j] + '_' + snake_y[j];
				if(j==0) $(id).addClass('head');
				else if(j%2 == 0) $(id).addClass('green');
				else $(id).addClass('red');

				str += '(' + snake_x[j] + ', ' + snake_y[j] + '), ';
			}
			str += '<br />';

			//$('#value').html(str);
		}
		else game_over();
	}

	function validate_position() {
		var id = '#pos' + snake_x[0] + '_' + snake_y[0];
		var ret1 = $(id).hasClass('green');
		var ret2 = $(id).hasClass('red');
		if(snake_x[0] < 0 || snake_x[0] >= n || snake_y[0] > 0 || snake_y[0] <= (-n)) // New position is out of grid
			return false;
		else if(!opposite_direction_allowed && (ret1 || ret2)) // New position is already an active coordinate of snake body (collision)
			return false;
		else return true;
	}

	function game_over() {
		$('.cell').removeClass('green');
		$('.cell').removeClass('red');
		$('.cell').removeClass('head');
		is_game_over = true;
		init();
		$('.field').html('<h1>GAME OVER</h1><h2>Total Point: ' + point + '</h2>');
	}

	function food() {
		$('.food').removeClass('food');
		var id = '';
		do {
			var x = get_a_number(2, n-2)
			var y = get_a_number(2, n-2)
			id = '#pos' + x + '_' + (-y);
			var ret1 = $(id).hasClass('green');
			var ret2 = $(id).hasClass('red');
			var ret3 = $(id).hasClass('head');
		}while(ret1 || ret2 || ret3);
		$(id).addClass('food');
		// console.log(id);
	}

	$('#start_button').on('click', function() {
		is_game_over = false;
		restart_interval();
	});

	$('#pause_button').on('click', function() {
		is_game_over = true;
	});

	$('#restart_button').on('click', function() {
		restart_game();
	});

	function restart_game() {
		is_game_over = true;
		point = 0;
		snake_length = 5;
		snake_x = new Array();
		snake_y = new Array();
		current_dir = 1;

		init();
		draw_snake();
		food();
		restart_interval();
	}

	$(document).on('change', '#opposite_direction_allowed', function() {
		opposite_direction_allowed = $(this).prop('checked');
	});

	function get_a_number(min,max) { // min and max included
	    return Math.floor(Math.random()*(max-min+1)+min);
	}

	function restart_interval() {
		clearInterval(main_interval);
		intrvl = $('#speed').val();
		intrvl = speed_arr[intrvl];
		main_interval = setInterval(function(){
			if(!is_game_over) {
				move();
				draw_snake();
			}
		}, intrvl);
	}

	function increase_speed() {
		var temp = $('#speed').val() * 1 + 1;
		var max = $('#speed').attr('max');
		if(temp > max) return;
		$('#speed').val(temp);
		restart_interval();
	}

	function decrease_speed() {
		var temp = $('#speed').val() * 1 - 1;
		var min = $('#speed').attr('min');
		if(temp < min) return;
		$('#speed').val(temp);
		restart_interval();
	}
});