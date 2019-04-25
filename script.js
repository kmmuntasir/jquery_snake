$(document).ready(function() {
	var point = 0;
	var intrvl = 50; // 100 ms
	var is_game_over = true;
	var opposite_direction_allowed = false; // Snake can go 
	var n = 50;
	var snake_length = 5;
	var snake_x = new Array();
	var snake_y = new Array();
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
	setInterval(function(){
		if(!is_game_over) {
		 	move();
		 	draw_snake();
		}
	}, intrvl);

	 $(document).keydown(function(e) {
	     switch(e.which) {
	         case 37: // left
	         if(opposite_direction_allowed) current_dir = 3;
	         else {
	         	if(current_dir != 1) current_dir = 3;
	         }
	         break;

	         case 38: // up
	         if(opposite_direction_allowed) current_dir = 0;
	         else {
	         	if(current_dir != 2) current_dir = 0;
	         }
	         break;

	         case 39: // right
	         if(opposite_direction_allowed) current_dir = 1;
	         else {
	         	if(current_dir != 3) current_dir = 1;
	         }
	         break;

	         case 40: // down
	         if(opposite_direction_allowed) current_dir = 2;
	         else {
	         	if(current_dir != 0) current_dir = 2;
	         }
	         break;

	         default: return; // exit this handler for other keys
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
			var x = Math.floor((Math.random() * n) + 1);
			var y = Math.floor((Math.random() * n) + 1);
			id = '#pos' + x + '_' + (-y);
			var ret1 = $(id).hasClass('green');
			var ret2 = $(id).hasClass('red');
			var ret3 = $(id).hasClass('head');
		}while(ret1 || ret2 || ret3);
		$(id).addClass('food');
	}

	$('#start_button').on('click', function() {
		is_game_over = false;
	});

	$('#pause_button').on('click', function() {
		is_game_over = true;
	});

	$('#restart_button').on('click', function() {
		is_game_over = false;
		init();
		draw_snake();
	});
});