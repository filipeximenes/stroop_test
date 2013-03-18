// -------------------------------------------------------------------
// -------------------------- Games ----------------------------------
// -------------------------------------------------------------------
/* 
    All kinds of game should insteract with the game area throught 
    a interface containing the methods:

    * start_game() - the method called after the count down ends.

    * controller((string) chosen_color) - is a callback method, called after 
    each answer given by the user.

    When the game ends if should call the log_result function 
    with a GameLog object.
*/

// ----------------------- Stroop Game --------------------------------

function StroopGame(number_of_collors, number_of_rounds, stroop){
    get_color_key_list(number_of_collors);
    this.number_of_rounds = number_of_rounds;
    this.round = 0;
    this.current_collor = null;
    this.started_att = null;
    this.ended_att = null;
    this.stroop = stroop
}

StroopGame.prototype.start_game = function(){
    this.started_att = new Date();
    this.game();
}

StroopGame.prototype.controller = function(chosen_color){
    if (chosen_color === this.current_collor){
        if (this.round < this.number_of_rounds){
            this.game();
        }else{
            this.ended_att = new Date();
            res = new GameLog(this.get_total_time(), true, this.stroop)
            log_result(res);
        }
    }else{
        this.ended_att = new Date();
        res = new GameLog(this.get_total_time(), false, this.stroop)
        log_result(res);
    }
}

StroopGame.prototype.game = function(){
    this.round += 1
    clear_game_area()
    this.current_collor = get_random_key();
    print_on_game(this.current_collor, this.stroop)
    populate_selectors_area()
}

StroopGame.prototype.get_total_time = function(){
    return (this.ended_att - this.started_att) / 1000
}

// -------------------------------------------------------------------
// ---------------------------- Logs ---------------------------------
// -------------------------------------------------------------------

function GameLog(total_time, result, stroop){
    this.total_time = total_time;
    this.result = result;
    this.stroop = stroop;
    this.round = 0;
}

GameLog.prototype.set_round = function(round){
    this.round = round
}

// -------------------------------------------------------------------
// ---------------------------- Utils --------------------------------
// -------------------------------------------------------------------

var color_names = {'Vermelho': 'red', 'Azul': 'blue', 'Verde': 'green', 'Preto': 'black'}
var color_keys = []

var game_playing = null
var logs = []

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function get_random_key(){
    color_list = get_color_key_list()
    return color_list[Math.floor(Math.random() * color_list.length)]
}

function get_color_key_list(size){
    if (size !== undefined && color_keys !== null && color_keys.length !== size){
        color_keys = []
    }
    if (color_keys.length === 0){
        if (size === undefined){
            size = 3;
        }

        color_keys = [];
        for (var key in color_names){
            color_keys.push(key);
        }
        color_keys = color_keys.slice(0,size);
    }

    return color_keys    
}

function successfull_attempts(){
    var successfull = 0;
    for (key in logs){
        if (logs[key].result){
            successfull += 1;
        }
    }
    return successfull
}

// -------------------------------------------------------------------
// ------------------------ Game Area --------------------------------
// -------------------------------------------------------------------

function play_count_down(showing_time, count_down){
    if (showing_time > 0){
        if (count_down === undefined){
            var count_down = $("<span></span>");
            $("#test_area").append(count_down);
        }
        count_down.text(showing_time);
        setTimeout(
            function (){
                play_count_down(
                    showing_time-1, 
                    count_down
                    );
            }, 1000);
    }else{
        count_down.remove()
        game_playing.start_game()
    }
}

function clear_game_area(){
    $("#test_area").html('');
    $("#selectors_area").html('');
}

function populate_selectors_area(){
    color_list = get_color_key_list().slice(0)
    color_list = shuffleArray(color_list)

    for (key in color_list){
        button = $("<button></button>");
        button.html(color_list[key]);
        button.click(function(){
            game_playing.controller($(this).text())
        })
        $("#selectors_area").append(button);
    }
}

function print_on_game(color_key, stroop){
    color_list = get_color_key_list()
    if (!stroop){
        text = "#####"
    }else{
        text = get_random_key()
    }
    chosen_color = color_names[color_key]
    span_tag = $("<span><span>")
    span_tag.text(text)
    span_tag.css('color', chosen_color)

    $("#test_area").append(span_tag)
}

function show_result(){
    clear_game_area()
    $("#start_button").show();
    $("#selectors_area").hide();
    for (key in logs){
        $("#test_area").append(logs[key].total_time + '<br>')
    }
}

function show_instruction(){
    clear_game_area()
    $("#start_button").show();
    $("#selectors_area").hide();
    $("#test_area").append("instruction");
    last_round = current_round;
}

var current_round = 0
var last_round = -1

function log_result(log){
    log.set_round(current_round)
    logs.push(log)
    last_round = current_round;
    if (log.result){
        current_round += 1;
    }
    show_result()
}

function start_test(stroop){
    clear_game_area()
    $("#start_button").hide();
    $("#selectors_area").show();
    game_playing = new StroopGame(3, 2, stroop)
    play_count_down(3)
}

function full_test(){
    if (current_round < 2){
        if (last_round === -1){
            show_instruction()
        }else{
            // stroop off pactice
            start_test(false)
        }
    }else if (current_round < 7){
        if (last_round === 1){
            show_instruction()
        }else{
            // stroop off
            start_test(false)
        }
    }else if (current_round < 9){
        if (last_round === 6){
            show_instruction()
        }else{
            // stroop on pactice
            start_test(true)
        }
    }else if (current_round < 14){
        if (last_round === 8){
            show_instruction()
        }else{
            // stroop on
            start_test(true)
        }
    }else{
        // completed
    }
}

$("#start_button").click(full_test);
