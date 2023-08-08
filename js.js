/*
0 - nic
1 - pion
2 - goniec
3 - skoczek
4 - wieża 
5 - hetman 
6 - król

1 - biali
2 - czarni
*/
let map = {
    8: [24,23,22,25,26,22,23,24],
    7: [21,21,21,21,21,21,21,21],
    6: [0,0,0,0,0,0,0,0],
    5: [0,0,0,0,0,0,0,0],
    4: [0,0,0,0,0,0,0,0],
    3: [0,0,0,0,0,0,0,0],
    2: [11,11,11,11,11,11,11,11],
    1: [14,13,12,15,16,12,13,14]
};

let map_aw = { //attack white
    8: [0,0,0,0,0,0,0,0],
    7: [0,0,0,0,0,0,0,0],
    6: [0,0,0,0,0,0,0,0],
    5: [0,0,0,0,0,0,0,0],
    4: [0,0,0,0,0,0,0,0],
    3: [2,2,3,2,2,3,2,2],
    2: [1,1,1,4,4,1,1,1],
    1: [0,1,1,1,1,1,1,0]
};

let map_ab = { // attack black
    8: [0,1,1,1,1,1,1,0],
    7: [1,1,1,4,4,1,1,1],
    6: [2,2,3,2,2,3,2,2],
    5: [0,0,0,0,0,0,0,0],
    4: [0,0,0,0,0,0,0,0],
    3: [0,0,0,0,0,0,0,0],
    2: [0,0,0,0,0,0,0,0],
    1: [0,0,0,0,0,0,0,0]
}; 

let AI_on = false // false
let bot_pawns = ["80","81","82","83","84","85","86","87","70","71","72","73","74","75","76","77"];

let move = 1 // 1 - player, 2 - bot/black player
let clicked_position = 0;
let players = false;
let is_check = false;
let game_start = false;
let check_moves = []
let w_king_position = "14";
let b_king_position = "84";
let w_castling = [1,1] 
let b_castling = [1,1] 
let flagged = []

const pawn_value = {
    1:1,
    2:3,
    3:3,
    4:5,
    5:9,
}

$(window).resize(function () {
    if($(document).width() < 600)
    {
        $(".contener").css("height", $(document).width());
    }
    else 
    {
        $(".contener").css("height", "600px");
    }
});

$(function() {

    if($(document).width() < 600)
    {
        $(".contener").css("height", $(document).width());
    }

    for(let i=8;i>0;i--)
    {
        $.each(map[i],(j, val) => {
            if (val != 0)
            {
                $(".contener").children(".field").eq(8 * (8 - i) + j).addClass("a"+val);
            }
        });
    }
    for(let i=8;i>0;i--)
    {
        $.each(map_ab[i],(j, _) => {
                $(".contener").children(".field").eq(8 * (8 - i) + j).html("");
        });
    }
    $(".field").on("click", (e) => {
        const id = e.target.id;
        if(id == ""){
            move_pawn(e.target.className[0] + e.target.className[1])
        }
        else 
        {
            const pawn = map[id[0]][parseInt(id[1].charCodeAt(0)) - 65];  
            //console.log(pawn + " | " + id);
            if(players)
            {
                if(pawn.toString()[0] == move)
                    move_option(pawn.toString(), id); 
            }
            else 
            {
                //if(move == 1)
                    move_option(pawn.toString(), id); 
            }
        }
    });

    $(".2players").on("click", () => {
        if(!AI_on)
        {
            players = true;
            for(let i = 1; i < 7; i++)
                $(".a2"+i).css({"transform": "rotateX(180deg)"});
        }
    });

    $(".Game").on("click", () => {
        AI_on = true;
    });


    $(".Reset").on("click", () => {
        map = {
            8: [24,23,22,25,26,22,23,24],
            7: [21,21,21,21,21,21,21,21],
            6: [0,0,0,0,0,0,0,0],
            5: [0,0,0,0,0,0,0,0],
            4: [0,0,0,0,0,0,0,0],
            3: [0,0,0,0,0,0,0,0],
            2: [11,11,11,11,11,11,11,11],
            1: [14,13,12,15,16,12,13,14]
        };

        map_aw = { //attack white
            8: [0,0,0,0,0,0,0,0],
            7: [0,0,0,0,0,0,0,0],
            6: [0,0,0,0,0,0,0,0],
            5: [0,0,0,0,0,0,0,0],
            4: [0,0,0,0,0,0,0,0],
            3: [2,2,3,2,2,3,2,2],
            2: [1,1,1,4,4,1,1,1],
            1: [0,1,1,1,1,1,1,0]
        };
        
        map_ab = { // attack black
            8: [0,1,1,1,1,1,1,0],
            7: [1,1,1,4,4,1,1,1],
            6: [2,2,3,2,2,3,2,2],
            5: [0,0,0,0,0,0,0,0],
            4: [0,0,0,0,0,0,0,0],
            3: [0,0,0,0,0,0,0,0],
            2: [0,0,0,0,0,0,0,0],
            1: [0,0,0,0,0,0,0,0]
        }; 

        AI_on = false;
        players = false;
        w_king_position = "14";
        b_king_position = "84";
        w_castling = [1,1]; 
        b_castling = [1,1]; 
        game_start = false; 
        move = 1;

        block_buttons();

        check_moves = [];
        is_check = false;
        $(".contener").css("border-color", "black");

        
        for(let i = 1; i < 7; i++)
            $(".a2"+i).css({"transform": "rotateX(0deg)"});

        let color = "white";

        for(let i=8;i>0;i--)
        {
            $.each(map[i],(j, val) => {
                if (val != 0)
                {
                    $(".contener").children(".field").eq(8 * (8 - i) + j).removeClass().addClass("field").addClass(color).addClass("a"+val).html("");
                }
                else 
                {
                    $(".contener").children(".field").eq(8 * (8 - i) + j).removeClass().addClass("field").addClass(color).html("");
                }
                if(color == "white") 
                    color = "black" 
                else 
                    color = "white"
            });
            if(color == "white") 
                color = "black" 
            else 
                color = "white"
        }
    });
});

function block_buttons()
{
    $(".Game").prop('disabled', game_start);
    $(".2players").prop('disabled', game_start);

    if(game_start)
    {
        $(".Game").addClass("button-discable");
        $(".2players").addClass("button-discable"); 
    }
    else 
    {
        $(".Game").removeClass("button-discable");
        $(".2players").removeClass("button-discable"); 
    }
}

function change_position(pawn, position, val = 1) 
{
    const positions = move_option(pawn, position, true)
    if(pawn[1] == 1)
    {
        if(pawn[0] == 1)
        {
            if(parseInt(position[1]) != 0) map_aw[parseInt(position[0]) + 1][parseInt(position[1]) - 1] += val;
            if(parseInt(position[1]) != 7) map_aw[parseInt(position[0]) + 1][parseInt(position[1]) + 1] += val;
        }
        else 
        {
            if(parseInt(position[1]) != 0) map_ab[position[0] - 1][parseInt(position[1]) - 1] += val;
            if(parseInt(position[1]) != 7) map_ab[position[0] - 1][parseInt(position[1]) + 1] += val; 
        }
    }
    else 
    {
        if(pawn[0] == 1)
        {
            positions.forEach(element => {
                map_aw[element[0]][element[1]] += val;
            });  
        }
        else 
        {
            positions.forEach(element => {
                map_ab[element[0]][element[1]] += val;
            });  
        }
    } 
}

function change_position_remove(position, changed = [])
{
    const positions_check = move_option("15", position, true)
    let found = []
    $.each(positions_check, function (_, value) { 
        const poz = map[value[0]][value[1]].toString()
        if((poz[1] == 5 || poz[1] == 2 || poz[1] == 4) && !changed.includes(value))
        {   
            found.push(value)
            const positions_delete = move_option(poz, value, true)
            if(poz[0] == 1)
            {
                positions_delete.forEach(element => {
                    map_aw[element[0]][element[1]] -= 1;
                });  
            }
            else 
            {
                positions_delete.forEach(element => {
                    map_ab[element[0]][element[1]] -= 1;
                });  
            }
        }
    });
    return found
}

function change_position_add(positions)
{
    $.each(positions, function (_, value) { 
        const pawn = map[value[0]][value[1]].toString()
        const positions_add = move_option(pawn, value, true)
        if(pawn[0] == 1)
        {
            positions_add.forEach(element => {
                map_aw[element[0]][element[1]] += 1;
            });  
        }
        else 
        {
            positions_add.forEach(element => {
                map_ab[element[0]][element[1]] += 1;
            });  
        }
    });
}

function move_pawn(position, ignore = true) 
{
    if(!game_start) 
    {
        game_start = true;
        block_buttons();
    }

    let pawn = map[clicked_position[0]][clicked_position[1]]

    if(pawn != 16) change_position("16", w_king_position, -1)
    if(pawn != 26) change_position("26", b_king_position, -1)

    change_position(pawn.toString(), clicked_position, -1) // clicked_positio - tam, gdzie stał | postion - tam gdzi idzie
    $("#"+clicked_position[0]+String.fromCharCode(parseInt(clicked_position[1]) + 65)).removeClass("a"+pawn);

    let delete_pawn = []
    if(map[position[0]][position[1]] != 0)
    {
        change_position(map[position[0]][position[1]].toString(), position, -1)
        delete_pawn.push(position)
        $("#"+position[0]+String.fromCharCode(parseInt(position[1]) + 65)).removeClass("a"+map[position[0]][position[1]]);

    }

    const changed = change_position_remove(clicked_position, delete_pawn);

    map[clicked_position[0]][clicked_position[1]] = 0;

    const changed2 = change_position_remove(position, changed);

    if(pawn == 11 && position[0] == 8) pawn = 15
    if(pawn == 21 && position[0] == 1) pawn = 25

    map[position[0]][position[1]] = pawn;

    change_position(pawn.toString(), position);
    change_position_add(changed.concat(changed2));

    $("#"+position[0]+String.fromCharCode(parseInt(position[1]) + 65)).addClass("a"+pawn);

    if(pawn.toString()[1] == "6")
    {
        if(pawn.toString()[0] == "1")
            w_king_position = position;
        else
            b_king_position = position
    }

    if(pawn != 16) {
        change_position("16", w_king_position)
        if(pawn == 14 && w_castling)
        {
            if(clicked_position[1] == 0)
                w_castling[0] = 0
            else if(clicked_position[1] == 7)
                w_castling[1] = 0
        }
    }
    else if(w_castling) 
    {
        if(position == 12 && w_castling[0] == 1)
        {
            clicked_position = "10"
            move_pawn("13", false)
        }
        else if(position == 16 && w_castling[1] == 1)
        {
            clicked_position = "17"
            move_pawn("15", false)
        }
        w_castling = false 
    }

    if(pawn != 26) {
        change_position("26", b_king_position)
        if(pawn == 24 && b_castling)
        {
            if(clicked_position[1] == 0)
                b_castling[0] = 0
            else if(clicked_position[1] == 7)
                b_castling[1] = 0
        }
    }
    else if(b_castling)
    {
        if(position == 82 && b_castling[0] == 1)
        {
            clicked_position = "80"
            move_pawn("83", false)
        }
        else if(position == 86 && b_castling[1] == 1)
        {
            clicked_position = "87"
            move_pawn("85", false)
        }
        b_castling = false 
    }

    if(map_aw[b_king_position[0]][b_king_position[1]] > 0)
    {
        is_check = true;
        $(".contener").css("border-color", "red");
        check_options(pawn.toString(), position);
    }
    else if(map_ab[w_king_position[0]][w_king_position[1]] > 0)
    {
        is_check = true;
        $(".contener").css("border-color", "red");
        check_options(pawn.toString(), position);
    }
    else if(is_check)
    {
        is_check = false;
        $(".contener").css("border-color", "black");
    }

    if(AI_on && ignore)
    {
        if(pawn.toString()[0] == "2")
        {
            bot_pawns = jQuery.grep(bot_pawns, function(value) {
                return value != clicked_position;
            });
            bot_pawns.push(position)
        }
        else if(delete_pawn.length > 0)
        {
            bot_pawns = jQuery.grep(bot_pawns, function(value) {
                return value != delete_pawn[0];
            });
            find_move()
        } 
        else 
        {
            find_move()
        }
    }
    
    if(players)
    {
        if(pawn.toString()[0] == "2")
        {
            $(".a"+pawn).css({"transform": "rotateX(180deg)"}); 
        }
    }

    clicked_position = 0
    if(ignore)
    {
        if(move == 1) 
            move = 2;
        else 
            move = 1;
  
    }

    // for(let i=8;i>0;i--)
    // {
    //     $.each(map_aw[i],(j, val) => {
    //             $(".contener").children(".field").eq(8 * (8 - i) + j).html(val);
    //     });
    // }
    show_options()
}

function check_options(pawn, position)
{
    check_moves = []
    if(pawn[0] == 2)
    {
        if(pawn[1] == 1 || pawn[1] == 3 || is_close(w_king_position, position))
        {
            check_moves.push(position);
        }
        else
        {
            const options = move_option(pawn, position, false, true);
            let diff = 0
            for (let i = options.length; i > 0; i--) 
            {
                if(diff > 0)
                {
                    check_moves.push(options[i])
                    if(diff != Math.abs(options[i] - options[i-1]))
                        break
                }
                else 
                {
                    if(options[i] == w_king_position)
                        diff = Math.abs(options[i] - options[i-1])
                }
            }
            check_moves.push(position);
        }
        if(is_end(w_king_position, 1))
        {
            alert("czarni wygrali")
            move = 3
        }
    }
    else 
    {
        if(pawn[1] == 1 || pawn[1] == 3 || is_close(b_king_position, position))
        {
            check_moves.push(position);
        }
        else
        {
            const options = move_option(pawn, position, false, true);
            let diff = 0
            for (let i = options.length; i > 0; i--) 
            {
                if(diff > 0)
                {
                    check_moves.push(options[i])
                    if(diff != Math.abs(options[i] - options[i-1]))
                        break
                }
                else 
                {
                    if(options[i] == b_king_position)
                        diff = Math.abs(options[i] - options[i-1])
                }
            }
            check_moves.push(position);
        }

        if(is_end(b_king_position, 2))
        {
            alert("biali wygrali")
            move = 3
        }
    }

}

function is_end(position, site)
{
    console.log(check_moves)
    const king_moves = move_option(site + "6", position, false, true);
    let found = true;
    if(king_moves.length == 0)
    {
        $.each(map, function (i, tab) {
            if(!found) return;
            $.each(tab, function (j, val) {
                if(val != 0)
                {
                    if(!found) return;
                    val = val.toString();
                    if(val[0] == site)
                    {
                        const options = move_option(val, i.toString() + j, false, true);
                        $.each(check_moves, function (_, value) { 
                             if(options.includes(value))
                                found = false;
                                return;
                        });
                    }
                }
            });
        });

        return found;
    }
    return false;
}

function move_option(pawn, localization, Wreturn = false, return_move = false) 
{
    let tocheck = []
    let index;
    if(/[A-H]/i.test(localization))
    {
        index = localization[1].charCodeAt(0) - 65;
    }
    else 
    {
        localization = localization.toString()
        index = parseInt(localization[1])
    }
    //console.log(pawn + " || " + localization)
    switch(parseInt(pawn[1])) 
    {
        case 6:
            let options2 = []
            if(localization[0] != 8) 
            {
                if(map[parseInt(localization[0]) + 1][index].toString()[0] != pawn[0] || Wreturn) 
                    if(pawn[0] == "1")
                    {
                        if(map_ab[parseInt(localization[0]) + 1][index] == 0)
                            options2.push(parseInt(localization[0]) + 1 + index.toString());
                    }
                    else
                    {
                        if(map_aw[parseInt(localization[0]) + 1][index] == 0)
                            options2.push(parseInt(localization[0]) + 1 + index.toString());
                    }
            }
            if(localization[0] != 1) 
            {
                if(map[localization[0] - 1][index].toString()[0] != pawn[0]  || Wreturn) 
                    if(pawn[0] == "1")
                    {
                        if(map_ab[localization[0] - 1][index] == 0)
                            options2.push(localization[0] - 1 + index.toString());
                    }
                    else
                    {
                        if(map_aw[localization[0] - 1][index] == 0)
                            options2.push(localization[0] - 1 + index.toString());
                    }
            }
            if(index < 7)
            {
                const down = (index + 1).toString();
                if(map[localization[0]][down].toString()[0] != pawn[0] || Wreturn ) 
                    if(pawn[0] == "1")
                    {
                        if(map_ab[localization[0]][down] == 0)
                            options2.push(localization[0] + down);
                    }
                    else
                    {
                        if(map_aw[localization[0]][down] == 0)
                            options2.push(localization[0] + down);
                    }
                if(localization[0] != 8)  
                    if(map[parseInt(localization[0]) + 1][down].toString()[0] != pawn[0] || Wreturn) 
                        if(pawn[0] == "1")
                        {
                            if(map_ab[parseInt(localization[0]) + 1][down] == 0)
                                options2.push(parseInt(localization[0]) + 1 + down);
                        }
                        else
                        {
                            if(map_aw[parseInt(localization[0]) + 1][down] == 0)
                                options2.push(parseInt(localization[0]) + 1 + down);
                        }
                if(localization[0] != 1)
                    if(map[localization[0] - 1][down].toString()[0] != pawn[0] || Wreturn)
                        if(pawn[0] == "1")
                        {
                            if(map_ab[localization[0] - 1][down] == 0)
                                options2.push(localization[0] - 1 + down);
                        }
                        else
                        {
                            if(map_aw[localization[0] - 1][down] == 0)
                                options2.push(localization[0] - 1 + down);
                        } 
            }
            if(index > 0)
            {
                const up = (index - 1).toString(); 
                if(map[localization[0]][up].toString()[0] != pawn[0] || Wreturn) 
                    if(pawn[0] == "1")
                    {
                        if(map_ab[localization[0]][up] == 0)
                            options2.push(localization[0] + up);
                    }
                    else
                    {
                        if(map_aw[localization[0]][up] == 0)
                            options2.push(localization[0] + up);
                    } 
                if(localization[0] != 8)  
                    if(map[parseInt(localization[0]) + 1][up].toString()[0] != pawn[0] || Wreturn)
                        if(pawn[0] == "1")
                        {
                            if(map_ab[parseInt(localization[0]) + 1][up] == 0)
                                options2.push(parseInt(localization[0]) + 1 + up);
                        }
                        else
                        {
                            if(map_aw[parseInt(localization[0]) + 1][up] == 0)
                                options2.push(parseInt(localization[0]) + 1 + up);
                        } 
                if(localization[0] != 1)
                    if(map[localization[0] - 1][up].toString()[0] != pawn[0] || Wreturn) 
                        if(pawn[0] == "1")
                        {
                            if(map_ab[localization[0] - 1][up] == 0)
                                options2.push(localization[0] - 1 + up);
                        }
                        else
                        {
                            if(map_aw[localization[0] - 1][up] == 0)
                                options2.push(localization[0] - 1 + up);
                        } 
            }
            if(!Wreturn && !return_move && !is_check)
            {
                if(pawn[0] == "1")
                {
                    if(w_castling[0] == 1 && map[1][1] == 0 && map[1][2] == 0 && map[1][3] == 0)
                    {
                        options2.push("12")
                    }
                    if(w_castling[1] == 1 && map[1][5] == 0 && map[1][6] == 0)
                    {
                        options2.push("16")
                    }
                }
                else
                {
                    if(b_castling[0] == 1 && map[8][1] == 0 && map[8][2] == 0 && map[8][3] == 0)
                    {
                        options2.push("82")
                    }
                    if(b_castling[1] == 1 && map[8][5] == 0 && map[8][6] == 0)
                    {
                        options2.push("86")
                    }
                }
            }


            if(pawn[0] == "1" &&  map_ab[localization[0]][index] != 0)
            {
                map[localization[0]][index] = 0
                const positions_check = move_option("15", localization, true)
                let found = true
                $.each(positions_check, function (_, value) { 
                    const poz = map[value[0]][value[1]].toString()
                    if((poz[1] == 5 || poz[1] == 2 || poz[1] == 4) && poz[0] == 2)
                    {   
                        const positions_delete = move_option(poz, value, true)
                        tocheck = options2.filter(value => (!positions_delete.includes(value) && !is_close(value, b_king_position)));
                        found = false;
                    }
                });
                if(found)
                    tocheck = options2.filter(value => !is_close(value, b_king_position));
                console.log(options2);
                map[localization[0]][index] = 16
            }
            else if(pawn[0] == "2" && map_aw[localization[0]][index] != 0)
            {
                if(is_check && pawn == 26) console.log(map[localization[0]][index])
                map[localization[0]][index] = 0
                const positions_check = move_option("25", localization, true)
                let found = true
                $.each(positions_check, function (_, value) { 
                    const poz = map[value[0]][value[1]].toString()
                    if((poz[1] == 5 || poz[1] == 2 || poz[1] == 4) && poz[0] == 1)
                    {   
                        found = false;
                        const positions_delete = move_option(poz, value, true)
                        tocheck = options2.filter(value => (!positions_delete.includes(value)  && !is_close(value, w_king_position)));
                    }
                });
                if(found)
                    tocheck = options2.filter(value => !is_close(value, w_king_position));
                map[localization[0]][index] = 26
            }
            else
            {
                if(pawn[0] == "1")
                    tocheck = options2.filter(value => !is_close(value, b_king_position));
                else 
                    tocheck = options2.filter(value => !is_close(value, w_king_position));
            }
            break;
        case 4:
            for (let i = index-1; i >= 0; i--) {
                if(map[localization[0]][i] != 0)
                {
                    // console.log(Math.floor(map[localization[0]][i]/10))
                    if(map[localization[0]][i].toString()[0] != pawn[0] || Wreturn)
                        tocheck.push(localization[0] + i);
                    break;
                }
                tocheck.push(localization[0] + i);
            }
            for (let i = index + 1; i < 8; i++) {
                if(map[localization[0]][i] != 0)
                {
                    if(map[localization[0]][i].toString()[0] != pawn[0] || Wreturn)
                        tocheck.push(localization[0] + i);
                    break;
                }
                tocheck.push(localization[0] + i);
            }
            for (let i = parseInt(localization[0]) - 1; i > 0; i--) {
                if(map[i][index] != 0)
                {
                    if(map[i][index].toString()[0] != pawn[0] || Wreturn)
                        tocheck.push(i + index.toString());
                    break;
                }
                tocheck.push(i + index.toString());
            }
            for (let i = parseInt(localization[0]) + 1; i <= 8; i++) {
                if(map[i][index] != 0)
                {
                    if(map[i][index].toString()[0] != pawn[0] || Wreturn)
                        tocheck.push(i + index.toString());
                    break;
                }
                tocheck.push(i + index.toString());
            }
            break;
        case 3:
            let options = []
            options.push(parseInt(localization[0]) + 1 + (index - 2).toString());
            options.push(parseInt(localization[0]) + 1 + (index + 2).toString());
            options.push(localization[0] - 1 + (index - 2).toString());
            options.push(localization[0] - 1 + (index + 2).toString());
            if(parseInt(localization[0]) + 2 <= 8) {
                options.push(parseInt(localization[0]) + 2 + (index - 1).toString());
                options.push(parseInt(localization[0]) + 2 + (index + 1).toString());
            }
            options.push(localization[0] - 2 + (index - 1).toString());
            options.push(localization[0] - 2 + (index + 1).toString());
            options.forEach(element => {
                if(element[1] != "-")
                    if($("#"+element[0]+String.fromCharCode(parseInt(element[1]) + 65)).length)
                        if(map[element[0]][element[1]].toString()[0] != pawn[0] || Wreturn)
                            tocheck.push(element)
            });
            break;
        case 5:
            for (let i = index-1; i >= 0; i--) {
                if(map[localization[0]][i] != 0)
                {
                    if(map[localization[0]][i].toString()[0] != pawn[0] || Wreturn)
                        tocheck.push(localization[0] + i);
                    break;
                }
                tocheck.push(localization[0] + i);
            }
            for (let i = index + 1; i < 8; i++) {
                if(map[localization[0]][i] != 0)
                {
                    if(map[localization[0]][i].toString()[0] != pawn[0] || Wreturn)
                        tocheck.push(localization[0] + i);
                    break;
                }
                tocheck.push(localization[0] + i);
            }
            for (let i = parseInt(localization[0]) - 1; i > 0; i--) {
                if(map[i][index] != 0)
                {
                    if(map[i][index].toString()[0] != pawn[0] || Wreturn)
                        tocheck.push(i + index.toString());
                    break;
                }
                tocheck.push(i + index.toString());
            }
            for (let i = parseInt(localization[0]) + 1; i <= 8; i++) {
                if(map[i][index] != 0)
                {
                    if(map[i][index].toString()[0] != pawn[0] || Wreturn)
                        tocheck.push(i + index.toString());
                    break;
                }
                tocheck.push(i + index.toString());
            }
        case 2:
            for (let i = 1; i < 8; i++) {
                if(localization[0] - i > 0 && index - i >= 0)
                {
                    if(map[localization[0] - i][index - i] != 0) 
                    {
                        if(map[localization[0] - i][index - i].toString()[0] != pawn[0] || Wreturn)
                            tocheck.push(localization[0] - i + (index - i).toString());
                        break
                    }
                    tocheck.push(localization[0] - i + (index - i).toString());
                } 
                else 
                { 
                    break 
                }
                
            }
            for (let i = 1; i < 8; i++) {
                if(localization[0] - i > 0 && index + i < 8)
                {
                    if(map[localization[0] - i][index + i] != 0) 
                    {
                        if(map[localization[0] - i][index + i].toString()[0] != pawn[0] || Wreturn)
                            tocheck.push(localization[0] - i + (index + i).toString());
                        break
                    }
                    tocheck.push(localization[0] - i + (index + i).toString());
                }
                else 
                { 
                    break 
                }
            }
            for (let i = 1; i < 8; i++) {
                if(parseInt(localization[0]) + i <= 8 && index + i < 8)
                {
                    if(map[parseInt(localization[0]) + i][index + i] != 0) 
                    {
                        if(map[parseInt(localization[0]) + i][index + i].toString()[0] != pawn[0] || Wreturn)
                        tocheck.push(parseInt(localization[0]) + i + (index + i).toString());
                        break
                    }
                    tocheck.push(parseInt(localization[0]) + i + (index + i).toString());
                }
                else 
                { 
                    break 
                }
            }
            for (let i = 1; i < 8; i++) {
                if(parseInt(localization[0]) + i <= 8 && index - i >= 0)
                {
                    if(map[parseInt(localization[0]) + i][index - i] != 0) 
                    {
                        if(map[parseInt(localization[0]) + i][index - i].toString()[0] != pawn[0] || Wreturn)
                        tocheck.push(parseInt(localization[0]) + i + (index - i).toString());
                        break
                    }
                    tocheck.push(parseInt(localization[0]) + i + (index - i).toString());
                }
                else 
                { 
                    break 
                }
            }
            break;
        case 1:
            if(pawn[0] == "1")
            {
                if(localization[0] == 2 && map[parseInt(localization[0]) + 2][index] == 0 && map[parseInt(localization[0]) + 1][index] == 0) tocheck.push(parseInt(localization[0]) + 2 + index.toString());
                if(map[parseInt(localization[0]) + 1][index] == 0) tocheck.push(parseInt(localization[0]) + 1 + index.toString());
                if(index != 0)
                    if(map[parseInt(localization[0]) + 1][index - 1].toString()[0] == "2") 
                        tocheck.push(parseInt(localization[0]) + 1 + (index - 1).toString());
                if(index != 7)
                    if(map[parseInt(localization[0]) + 1][index + 1].toString()[0] == "2") 
                        tocheck.push(parseInt(localization[0]) + 1 + (index + 1).toString());
            } 
            else
            {
                if(localization[0] == 7 && map[parseInt(localization[0]) - 2][index] == 0 && map[parseInt(localization[0]) - 1][index] == 0) tocheck.push(localization[0] - 2 + index.toString());
                if(map[parseInt(localization[0]) - 1][index] == 0) tocheck.push(localization[0] - 1 + index.toString());
                if(index != 0)
                    if(map[parseInt(localization[0]) - 1][index - 1].toString()[0] == "1") 
                        tocheck.push(localization[0] - 1 + (index - 1).toString());
                if(index != 7)
                    if(map[parseInt(localization[0]) - 1][index + 1].toString()[0] == "1") 
                        tocheck.push(localization[0] - 1 + (index + 1).toString());
            }
            break;
    }
    if(Wreturn || return_move)
        return tocheck 

    clicked_position = parseInt(localization[0]) + index.toString();

    if(is_check && pawn[1] != 6)
    {
        show_options(tocheck.filter(value => check_moves.includes(value)));
    }
    else
    {
        if(pawn[1] != 6)
        {
            const positions_check = move_option("25", localization, true);
            let found = [0,0];
            $.each(positions_check, function (_, value) { 
                const poz = map[value[0]][value[1]].toString();
                if(((poz[1] == 5 || poz[1] == 2 || poz[1] == 4) && poz[0] != pawn[0]) || (poz[0] == pawn[0] && poz[1] == 6))
                {   
                    if(poz[0] == pawn[0])
                        found[0] = 1;
                    else
                        found[1] = 1;
                }
            });
            if(found[0] == 1 && found[1] == 1)
            {
                map[localization[0]][index] = 0;
                let options;
                let result = [];
                if(pawn[0] == 1)
                    options = move_option("15", w_king_position, true);
                else 
                    options = move_option("15", b_king_position, true); 
        
                //console.log(options)
                let diff = 0
                for (let i = options.length - 1; i >= 0; i--) 
                {
                    if(diff > 0)
                    {
                        result.push(options[i]);
                        if(diff != Math.abs(options[i] - options[i-1]))
                            if(result.includes(localization[0]+index))
                                break;
                            else 
                                {
                                    diff = 0;
                                    result = [];
                                }
                    }
                    else 
                    {
                        const field = map[options[i][0]][options[i][1]].toString();
                        if(field[0] != pawn[0] && (field[1] == 5 || field[1] == 4 || field[1] == 2))
                            diff = Math.abs(options[i] - options[i-1])
                    }
                }

                result = jQuery.grep(result, function(value) 
                {
                    return value != localization[0]+index;
                });

                map[localization[0]][index] = pawn;
                console.log(result);
                if(result.length > 0)
                    show_options(tocheck.filter(value => result.includes(value)));
                else
                    show_options(tocheck);
            }
            else 
                show_options(tocheck);
        }
        else 
            show_options(tocheck);
    }
}

function is_close(x,y)
{
    const diff = Math.abs(x-y)
    if(diff == 1 || diff == 10 || diff == 11 || diff == 9) return true
    return false
}

function show_options(options = []) 
{
    flagged.forEach(element => {
        $("#"+element[0]+String.fromCharCode(parseInt(element[1]) + 65)).html(""); // add ""
    });

    flagged = options
    options.forEach(element => {
        if(map[element[0]][element[1]] != 0) 
        {
            $("#"+element[0]+String.fromCharCode(parseInt(element[1]) + 65)).html("<div class='"+element+" flag'></div>"); 
        } 
        else 
        {
            $("#"+element[0]+String.fromCharCode(parseInt(element[1]) + 65)).html("<div class = '"+element+"'></div>");  
        }
    });

    for(let i=8;i>0;i--)
    {
        $.each(map[i],(j, val) => {
            if (val != 0)
            {
                $(".contener").children(".field").eq(8 * (8 - i) + j).addClass("a"+val);
            }
        });
    }

}

// AI section

function find_move()
{
    let options = [] //1-10 Advancement of movement | from | to
    let global_options = []
    $.each(bot_pawns,(_, val) => {
        let positions = move_option(map[val[0]][val[1]].toString(), val, false, true);
        if(is_check && map[val[0]][val[1]].toString()[1] != 6)
            positions = positions.filter(value => check_moves.includes(value));
        $.each(positions,(_, value) => {
            const pawn = map[val[0]][val[1]].toString()
            const target = map[value[0]][value[1]].toString()
            global_options.push([val, value])
            if(target[0] == 1)
            {
                if(map_aw[value[0]][value[1]] == 0)
                {
                    if(target[1] == 5)
                        options.push([9, val, value])
                    else 
                        options.push([8, val, value])
                }
                else if(pawn_value[target[1]] > pawn_value[pawn[1]])
                    {
                        if(target[1] == 5 && pawn[1] != 5)
                            options.push([9, val, value])
                        else 
                            options.push([7, val, value])
                    }
            }
            else if(map_aw[value[0]][value[1]] == 0)
            {
                options.push([5, val, value]);
            }
            else if(map_aw[value[0]][value[1]] > 0)
            {
                if(map_ab[value[0]][value[1]] == map_aw[value[0]][value[1]])
                    if(pawn[1] == 1)
                        options.push([5, val, value]); 
                    else 
                        options.push([4, val, value]); 
                else if(map_ab[value[0]][value[1]] > map_aw[value[0]][value[1]])
                    if(pawn[1] == 5)
                        options.push([1, val, value]); 
                    else 
                        options.push([5, val, value]); 
                else 
                    options.push([1, val, value]); 
            }
        });
    });

    // console.log(options);
    // console.log(global_options);
    if(options.length > 0 )
        {
            let naj = options[0]
            Math.floor(Math.random() * 100);
            for (let i = 1; i < options.length; i++) {
                if(naj[0] < options[i][0] || (naj[0] == options[i][0] && Math.floor(Math.random() * 3) == 1))
                    naj = options[i]
            }
            clicked_position = naj[1]
            move_pawn(naj[2])
        }
    else 
        {
            if(global_options.length > 0)
            {
                let los = Math.floor(Math.random() * global_options.length);
                clicked_position = global_options[los][0];
                move_pawn(global_options[los][1]); 
            }
        }
    //console.log(options)
}