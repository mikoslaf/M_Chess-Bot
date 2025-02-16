import { GoogleGenerativeAI } from "./node_modules/@google/generative-ai/dist/index.mjs";
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
    1: [14,13,12,15,16,12,13,14],
};

let map_aw = { //attack white
    8: [0,0,0,0,0,0,0,0],
    7: [0,0,0,0,0,0,0,0],
    6: [0,0,0,0,0,0,0,0],
    5: [0,0,0,0,0,0,0,0],
    4: [0,0,0,0,0,0,0,0],
    3: [2,2,3,2,2,3,2,2],
    2: [1,1,1,4,4,1,1,1],
    1: [0,1,1,1,1,1,1,0],
};

let map_ab = { // attack black
    8: [0,1,1,1,1,1,1,0],
    7: [1,1,1,4,4,1,1,1],
    6: [2,2,3,2,2,3,2,2],
    5: [0,0,0,0,0,0,0,0],
    4: [0,0,0,0,0,0,0,0],
    3: [0,0,0,0,0,0,0,0],
    2: [0,0,0,0,0,0,0,0],
    1: [0,0,0,0,0,0,0,0],
}; 

let AI_on = true // false
let bot_pawns = ["80","81","82","83","84","85","86","87","70","71","72","73","74","75","76","77"];

let move = 1 // 1 - player, 2 - bot/black player
let clicked_position = 0;
let players = false;
let is_check = false;
let game_start = false;
let check_moves = [];
let w_king_position = "14";
let b_king_position = "84";
let w_castling = [1,1];
let b_castling = [1,1]; 
let flagged = [];
let en_passant = 0;

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
            1: [14,13,12,15,16,12,13,14],
        };

        map_aw = { //attack white
            8: [0,0,0,0,0,0,0,0],
            7: [0,0,0,0,0,0,0,0],
            6: [0,0,0,0,0,0,0,0],
            5: [0,0,0,0,0,0,0,0],
            4: [0,0,0,0,0,0,0,0],
            3: [2,2,3,2,2,3,2,2],
            2: [1,1,1,4,4,1,1,1],
            1: [0,1,1,1,1,1,1,0],
        };
        
        map_ab = { // attack black
            8: [0,1,1,1,1,1,1,0],
            7: [1,1,1,4,4,1,1,1],
            6: [2,2,3,2,2,3,2,2],
            5: [0,0,0,0,0,0,0,0],
            4: [0,0,0,0,0,0,0,0],
            3: [0,0,0,0,0,0,0,0],
            2: [0,0,0,0,0,0,0,0],
            1: [0,0,0,0,0,0,0,0],
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
        $(".contener_end").removeClass("contener_end-in");

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

    if(pawn != 16) change_position("16", w_king_position, -1);
    if(pawn != 26) change_position("26", b_king_position, -1);

    change_position(pawn.toString(), clicked_position, -1); // clicked_positio - tam, gdzie stał | postion - tam gdzi idzie
    $("#"+clicked_position[0]+String.fromCharCode(parseInt(clicked_position[1]) + 65)).removeClass("a"+pawn);

    const delete_pawn = [];
    if(map[position[0]][position[1]] != 0)
    {
        change_position(map[position[0]][position[1]].toString(), position, -1);
        delete_pawn.push(position);
        $("#"+position[0]+String.fromCharCode(parseInt(position[1]) + 65)).removeClass("a"+map[position[0]][position[1]]);
    }

    let position_todelete = 0;
    if(position == en_passant)
    {
        position_todelete = (en_passant[0] == 3) ?
            parseInt(en_passant[0]) + 1 + en_passant[1].toString() :
            parseInt(en_passant[0]) - 1 + en_passant[1].toString();
        change_position(map[position_todelete[0]][position_todelete[1]].toString(), position_todelete, -1);
        delete_pawn.push(position_todelete);
        $("#"+position_todelete[0]+String.fromCharCode(parseInt(position_todelete[1]) + 65)).removeClass("a"+map[position_todelete[0]][position_todelete[1]]);
    }

    const changed = change_position_remove(clicked_position, delete_pawn);

    map[clicked_position[0]][clicked_position[1]] = 0;

    const changed2 = change_position_remove(position, changed);

    if(pawn == 11 && position[0] == 8) pawn = 15
    if(pawn == 21 && position[0] == 1) pawn = 25

    map[position[0]][position[1]] = pawn;

    if(position_todelete != 0)
        map[position_todelete[0]][position_todelete[1]] = 0;

    change_position_add(changed.concat(changed2));
    change_position(pawn.toString(), position);

    $("#"+position[0]+String.fromCharCode(parseInt(position[1]) + 65)).addClass("a"+pawn);

    if(pawn.toString()[1] == "6")
    {
        if(pawn.toString()[0] == "1")
            w_king_position = position;
        else
            b_king_position = position;
    }

    if(pawn != 16) {
        change_position("16", w_king_position);
        if(pawn == 14 && w_castling)
        {
            if(clicked_position[1] == 0)
                w_castling[0] = 0;
            else if(clicked_position[1] == 7)
                w_castling[1] = 0;
        }
    }
    else if(w_castling) 
    {
        if(position == 12 && w_castling[0] == 1)
        {
            clicked_position = "10";
            move_pawn("13", false);
        }
        else if(position == 16 && w_castling[1] == 1)
        {
            clicked_position = "17";
            move_pawn("15", false);
        }
        w_castling = false;
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
        check_options(pawn.toString(), position, true);
    }
    else if(is_check)
    {
        is_check = false;
        $(".contener").css("border-color", "black");
    } else if(is_draw(pawn.toString()[0]))
    {
        end("Draw");
        move = 3;
    }

    if(delete_pawn.length > 0 && is_draw_kings())
    {
        end("Draw");
        move = 3;
    }

    if(en_passant != 0)
        en_passant = 0;

    if(pawn.toString()[1] == "1")
    {
        if(clicked_position[0] == 2 && position[0] == 4)
        {
            en_passant = "3" + clicked_position[1];
        }
        else if(clicked_position[0] == 7 && position[0] == 5)
        {
            en_passant = "6" + clicked_position[1];
        }
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

function is_draw_kings()
{
    for (let column = 1; column <= 8; column++) 
    {
        for (let index = 0; index <= 7; index++) 
        {
          const pawn = map[column][index];
          if (pawn != 0 && pawn.toString()[1] != 6)
          {
            return false;
          }
        }
    }
    return true;
}

function is_draw(site)
{
    site = (site == 1) ? 2 : 1;
    const position = (site == 1) ? w_king_position : b_king_position;
    const king_options = move_option(site + "6", position, false, true);
    if (king_options.length == 0)
    {

        for (let column = 1; column <= 8; column++) {
          for (let index = 0; index <= 7; index++) {
            const pawn = map[column][index];
            if (pawn != 0 && pawn.toString()[0] == site)
            {
                const pawn_position = column + index.toString();
                const options = move_option(pawn.toString(), pawn_position, false, true);
                if(options.length > 0)
                    return false;
            }
          }
        }
        
        return true;
    }
    return false;
}

function check_options(pawn, position, white)
{
    check_moves = []
    if(white)
    {
        if(pawn[1] == 1 || pawn[1] == 3 || is_close(w_king_position, position))
        {
            check_moves.push(position);
        }
        else
        {
            const options = move_option("15", w_king_position, false, true);
            let diff = 0
            for (let i = options.length - 1; i >= 0; i--) 
            {
                if(diff > 0)
                {
                    check_moves.push(options[i])
                    if(diff != Math.abs(options[i] - options[i-1]))
                        break;
                }
                else 
                {
                    const column = options[i].toString()[0];
                    const index = options[i].toString()[1];
                    const space = map[column][index].toString();
                    if(space[0] == 2 && (space[1] == 2 || space[1] == 4 || space[1] == 5))
                    {
                        diff = Math.abs(options[i] - options[i-1]);
                        check_moves.push(options[i]);
                    }
                }
            }
        }
        if(is_end(w_king_position, 1))
        {
            end("Blacks wins");
            move = 3;
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
            const options = move_option("25", b_king_position, false, true);
            let diff = 0
            for (let i = options.length - 1; i >= 0; i--) 
            {
                if(diff > 0)
                {
                    check_moves.push(options[i])
                    if(diff != Math.abs(options[i] - options[i-1]))
                        break;
                }
                else 
                {
                    const column = options[i].toString()[0];
                    const index = options[i].toString()[1];
                    const space = map[column][index].toString();
                    if(space[0] == 1 && (space[1] == 2 || space[1] == 4 || space[1] == 5))
                    {
                        diff = Math.abs(options[i] - options[i-1]);
                        check_moves.push(options[i]);
                    }
                }
            }
        }

        if(is_end(b_king_position, 2))
        {
            end("White wins");
            move = 3;
        }
    }

}

function is_end(position, site)
{
    //console.log(check_moves)
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

function end(result)
{
    $(".contener_end h2").html(result);
    $(".contener_end").addClass("contener_end-in");
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
                const column = parseInt(localization[0]) + 1;
                if(map[column][index].toString()[0] != pawn[0] || Wreturn) 
                    if(pawn[0] == "1")
                    {
                        if(map_ab[column][index] == 0)
                            options2.push(column + index.toString());
                    }
                    else
                    {
                        if(map_aw[column][index] == 0)
                            options2.push(column + index.toString());
                    }
            }
            if(localization[0] != 1) 
            {
                const column = localization[0] - 1;
                if(map[column][index].toString()[0] != pawn[0]  || Wreturn) 
                    if(pawn[0] == "1")
                    {
                        if(map_ab[column][index] == 0)
                            options2.push(column + index.toString());
                    }
                    else
                    {
                        if(map_aw[column][index] == 0)
                            options2.push(column + index.toString());
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
                    {
                    const column = parseInt(localization[0]) + 1;
                    if(map[column][down].toString()[0] != pawn[0] || Wreturn) 
                        if(pawn[0] == "1")
                        {
                            if(map_ab[column][down] == 0)
                                options2.push(column + down);
                        }
                        else
                        {
                            if(map_aw[column][down] == 0)
                                options2.push(column + down);
                        }
                    }
                if(localization[0] != 1)
                    {
                        const column = localization[0] - 1;
                        if(map[column][down].toString()[0] != pawn[0] || Wreturn)
                            if(pawn[0] == "1")
                            {
                                if(map_ab[column][down] == 0)
                                    options2.push(column + down);
                            }
                            else
                            {
                                if(map_aw[column][down] == 0)
                                    options2.push(column + down);
                            } 
                    }
            }
            if(index > 0)
            {
                const up = (index - 1).toString(); 
                const column = localization[0];
                if(map[column][up].toString()[0] != pawn[0] || Wreturn) 
                    if(pawn[0] == "1")
                    {
                        if(map_ab[column][up] == 0)
                            options2.push(column + up);
                    }
                    else
                    {
                        if(map_aw[column][up] == 0)
                            options2.push(column + up);
                    } 
                if(column != 8)
                    {
                        const local_column = parseInt(column) + 1;
                        if(map[local_column][up].toString()[0] != pawn[0] || Wreturn)
                            if(pawn[0] == "1")
                            {
                                if(map_ab[local_column][up] == 0)
                                    options2.push(local_column + up);
                            }
                            else
                            {
                                if(map_aw[local_column][up] == 0)
                                    options2.push(local_column + up);
                            } 
                    }
                if(column != 1)
                    {
                        const local_column = column - 1;
                        if(map[local_column][up].toString()[0] != pawn[0] || Wreturn) 
                            if(pawn[0] == "1")
                            {
                                if(map_ab[local_column][up] == 0)
                                    options2.push(local_column + up);
                            }
                            else
                            {
                                if(map_aw[local_column][up] == 0)
                                    options2.push(local_column + up);
                            } 
                    }
            }
            if(!Wreturn && !return_move && !is_check)
            {
                if(pawn[0] == "1")
                {
                    if(w_castling[0] == 1 && map[1][1] == 0 && map[1][2] == 0 && map[1][3] == 0 && map[1][0] == 14)
                    {
                        options2.push("12");
                    }
                    if(w_castling[1] == 1 && map[1][5] == 0 && map[1][6] == 0 && map[1][7] == 14)
                    {
                        options2.push("16");
                    }
                }
                else
                {
                    if(b_castling[0] == 1 && map[8][1] == 0 && map[8][2] == 0 && map[8][3] == 0 && map[8][0] == 24)
                    {
                        options2.push("82");
                    }
                    if(b_castling[1] == 1 && map[8][5] == 0 && map[8][6] == 0 && map[8][7] == 24)
                    {
                        options2.push("86");
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
                        const positions_delete = move_option(poz, value, true) // this function is evli, fix it!
                        tocheck = options2.filter(value => (!positions_delete.includes(value) && !is_close(value, b_king_position)));
                        found = false;
                    }
                });
                if(found)
                    tocheck = options2.filter(value => !is_close(value, b_king_position));
                //console.log(options2);
                map[localization[0]][index] = 16
            }
            else if(pawn[0] == "2" && map_aw[localization[0]][index] != 0)
            {
                //if(is_check && pawn == 26) console.log(map[localization[0]][index])
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
            const column = localization[0];
            for (let i = index-1; i >= 0; i--) {
                if(map[column][i] != 0)
                {
                    if(map[column][i].toString()[0] != pawn[0] || Wreturn)
                        tocheck.push(column + i);
                    break;
                }
                tocheck.push(column + i);
            }
            for (let i = index + 1; i < 8; i++) {
                if(map[column][i] != 0)
                {
                    if(map[column][i].toString()[0] != pawn[0] || Wreturn)
                        tocheck.push(column + i);
                    break;
                }
                tocheck.push(column + i);
            }
            for (let i = parseInt(column) - 1; i > 0; i--) {
                if(map[i][index] != 0)
                {
                    if(map[i][index].toString()[0] != pawn[0] || Wreturn)
                        tocheck.push(i + index.toString());
                    break;
                }
                tocheck.push(i + index.toString());
            }
            for (let i = parseInt(column) + 1; i <= 8; i++) {
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
            const column_3 = parseInt(localization[0]);
            let options = [
            column_3 + 1 + (index - 2).toString(),
            column_3 + 1 + (index + 2).toString(),
            column_3 - 1 + (index - 2).toString(),
            column_3 - 1 + (index + 2).toString(),
            column_3 - 2 + (index - 1).toString(),
            column_3 - 2 + (index + 1).toString(),
            ];
            if(column_3 + 2 <= 8) {
                options = [
                    ...options, 
                    column_3 + 2 + (index - 1).toString(), 
                    column_3 + 2 + (index + 1).toString(),
                ];
            }
            options.forEach(element => {
                if(element[1] != "-")
                    if($("#"+element[0]+String.fromCharCode(parseInt(element[1]) + 65)).length)
                        if(map[element[0]][element[1]].toString()[0] != pawn[0] || Wreturn)
                            tocheck.push(element)
            });
            break;
        case 5:
            const column_5 = localization[0];
            for (let i = index-1; i >= 0; i--) {
                if(map[column_5][i] != 0)
                {
                    if(map[column_5][i].toString()[0] != pawn[0] || Wreturn)
                        tocheck.push(column_5 + i);
                    break;
                }
                tocheck.push(column_5 + i);
            }
            for (let i = index + 1; i < 8; i++) {
                if(map[column_5][i] != 0)
                {
                    if(map[column_5][i].toString()[0] != pawn[0] || Wreturn)
                        tocheck.push(column_5 + i);
                    break;
                }
                tocheck.push(column_5 + i);
            }

            const column_int5 =  parseInt(localization[0]);
            for (let i = column_int5 - 1; i > 0; i--) {
                if(map[i][index] != 0)
                {
                    if(map[i][index].toString()[0] != pawn[0] || Wreturn)
                        tocheck.push(i + index.toString());
                    break;
                }
                tocheck.push(i + index.toString());
            }
            for (let i = column_int5 + 1; i <= 8; i++) {
                if(map[i][index] != 0)
                {
                    if(map[i][index].toString()[0] != pawn[0] || Wreturn)
                        tocheck.push(i + index.toString());
                    break;
                }
                tocheck.push(i + index.toString());
            }
        case 2:
            const column_2 = localization[0];
            for (let i = 1; i < 8; i++) {
                if(column_2 - i > 0 && index - i >= 0)
                {
                    if(map[column_2 - i][index - i] != 0) 
                    {
                        if(map[column_2 - i][index - i].toString()[0] != pawn[0] || Wreturn)
                            tocheck.push(column_2 - i + (index - i).toString());
                        break;
                    }
                    tocheck.push(column_2 - i + (index - i).toString());
                } 
                else 
                { 
                    break; 
                }
                
            }
            for (let i = 1; i < 8; i++) {
                if(column_2 - i > 0 && index + i < 8)
                {
                    if(map[column_2 - i][index + i] != 0) 
                    {
                        if(map[column_2 - i][index + i].toString()[0] != pawn[0] || Wreturn)
                            tocheck.push(column_2 - i + (index + i).toString());
                        break
                    }
                    tocheck.push(column_2 - i + (index + i).toString());
                }
                else 
                { 
                    break 
                }
            }

            const column_int2 = parseInt(localization[0]);
            for (let i = 1; i < 8; i++) {
                if(column_int2 + i <= 8 && index + i < 8)
                {
                    if(map[column_int2 + i][index + i] != 0) 
                    {
                        if(map[column_int2 + i][index + i].toString()[0] != pawn[0] || Wreturn)
                        tocheck.push(column_int2 + i + (index + i).toString());
                        break
                    }
                    tocheck.push(column_int2 + i + (index + i).toString());
                }
                else 
                { 
                    break 
                }
            }
            for (let i = 1; i < 8; i++) {
                if(column_int2 + i <= 8 && index - i >= 0)
                {
                    if(map[column_int2 + i][index - i] != 0) 
                    {
                        if(map[column_int2 + i][index - i].toString()[0] != pawn[0] || Wreturn)
                        tocheck.push(column_int2 + i + (index - i).toString());
                        break
                    }
                    tocheck.push(column_int2 + i + (index - i).toString());
                }
                else 
                { 
                    break 
                }
            }
            break;
        case 1:
            const column_1 = parseInt(localization[0]);
            const column_str1 = localization[0];
            if(pawn[0] == "1")
            {
                if(column_str1 == 2 && map[column_1 + 2][index] == 0 && map[column_1 + 1][index] == 0) 
                    tocheck.push(column_1 + 2 + index.toString());
                if(map[column_1 + 1][index] == 0) 
                    tocheck.push(column_1 + 1 + index.toString());
                if(index != 0)
                    if(map[column_1 + 1][index - 1].toString()[0] == "2" || 
                    (column_1 + 1 + (index - 1).toString() == en_passant && column_1 != 2)
                    ) 
                        tocheck.push(column_1 + 1 + (index - 1).toString());
                if(index != 7)
                    if(map[column_1 + 1][index + 1].toString()[0] == "2" ||
                    (column_1 + 1 + (index + 1).toString() == en_passant && column_1 != 2)
                    ) 
                        tocheck.push(column_1 + 1 + (index + 1).toString());
            } 
            else
            {
                if(column_str1 == 7 && map[column_1 - 2][index] == 0 && map[column_1 - 1][index] == 0) 
                    tocheck.push(column_str1 - 2 + index.toString());
                if(map[column_1 - 1][index] == 0) 
                    tocheck.push(column_str1 - 1 + index.toString());
                if(index != 0)
                    if(map[column_1 - 1][index - 1].toString()[0] == "1" ||
                    (column_1 - 1 + (index - 1).toString() == en_passant && column_1 != 7)) 
                        tocheck.push(column_str1 - 1 + (index - 1).toString());
                if(index != 7)
                    if(map[column_1 - 1][index + 1].toString()[0] == "1" || 
                    (column_1 - 1 + (index + 1).toString() == en_passant && column_1 != 7)) 
                        tocheck.push(column_str1 - 1 + (index + 1).toString());
            }
            break;
    }

    if(Wreturn)
        return tocheck;

    if(is_check && pawn[1] != 6)
    {
        if(return_move)
            return tocheck;
        else 
        {
            clicked_position = parseInt(localization[0]) + index.toString();
            show_options(tocheck.filter(value => check_moves.includes(value)));
            return;
        }
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
                    {
                        const position = ((pawn[0] == 1) ? w_king_position : b_king_position).toString();
                        if(poz[1] == 4)
                        {
                            if(position[0] == value[0] || position[1] == value[1])
                                found[1] = 1;
                        }
                        else if(poz[1] == 2)
                        {
                            if(position[0] != value[0] && position[1] != value[1])
                                found[1] = 1;
                        }
                        else if(poz[1] == 5)
                            found[1] = 1;
                    }
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
                            {
                                diff = Math.abs(options[i] - options[i-1]);
                                result.push(options[i]);
                            }
                    }
                }

                result = jQuery.grep(result, function(value) 
                {
                    return value != localization[0] + index;
                });

                map[localization[0]][index] = pawn;

                if(result.length > 0)
                    if(return_move)
                        return tocheck.filter(value => result.includes(value));
                    else
                    {
                        clicked_position = parseInt(localization[0]) + index.toString();
                        show_options(tocheck.filter(value => result.includes(value)));
                        return;
                    }
            }
        }
    }
    if(return_move)
        return tocheck;
    else 
    {
        clicked_position = parseInt(localization[0]) + index.toString();
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

async function find_move()
{
    let options = [] //1-10 Advancement of movement | from | to
    let global_options = []
    $.each(bot_pawns,(_, val) => {
        let positions = move_option(map[val[0]][val[1]].toString(), val, false, true);
        if(is_check && map[val[0]][val[1]].toString()[1] != 6)
            positions = positions.filter(value => check_moves.includes(value));

        const pawn = map[val[0]][val[1]].toString();
        let mod = 0;
        if(pawn[1] == 5 && map_aw[val[0]][val[1]] > 0)
            mod += 2;
        if(map_aw[val[0]][val[1]] > map_ab[val[0]][val[1]])
            mod += 1; 
        $.each(positions,(_, value) => {
            const target = map[value[0]][value[1]].toString();
            const attack_white_to = map_aw[value[0]][value[1]];
            const attack_black_to = map_ab[value[0]][value[1]];

            global_options.push([val, value]);
            if(target[0] == 1)
            {
                if(attack_white_to == 0)
                {
                    if(target[1] == 5)
                        options.push([9 + mod, val, value]);
                    else 
                        options.push([8 + mod, val, value]);
                }
                else if(pawn_value[target[1]] > pawn_value[pawn[1]])
                    {
                        if(target[1] == 5 && pawn[1] != 5)
                            options.push([9 + mod, val, value]);
                        else 
                            options.push([4, val, value]);
                    }
                else if(pawn_value[target[1]] == pawn_value[pawn[1]])
                    {
                        if(pawn[1] != 5)
                            if(attack_black_to > attack_white_to)
                                options.push([6 + mod, val, value]); 
                    }
            }
            else if(attack_white_to == 0)
            {
                if(is_close(value, w_king_position)) //  && attack_black_to < 1
                    options.push([1 + mod, val, value]);
                else 
                    if(pawn[1] == 6)
                        options.push([4 + mod, val, value]);
                    else 
                        options.push([5 + mod, val, value]);
            }
            else if(attack_white_to > 0)
            {
                if(is_close_pawn11(value) && pawn != 21)
                {
                    options.push([2 + mod, val, value]); 
                }
                else 
                {
                    if(attack_black_to == attack_white_to)
                        if(pawn[1] == 1)
                            options.push([5 + mod, val, value]); 
                        else 
                            options.push([4 + mod, val, value]); 
                    else if(attack_black_to > attack_white_to)
                        if(pawn[1] == 5)
                            options.push([1 + mod, val, value]); 
                        else 
                            options.push([5 + mod, val, value]); 
                    else 
                        options.push([1 + mod, val, value]); 
                }
            }
        });
    });

    //console.table(options);
    // console.log(global_options);
    
    let ai_move; 
    if(options.length > 0)
        ai_move = await AI(map, options);
    else 
    ai_move = await AI(map, global_options);

    if (ai_move.length > 0){
    
        ai_move = convert_position(map, ai_move)
        
        if(ai_move)
            {
                clicked_position = ai_move[0];
                move_pawn(ai_move[1]);
                return;
            }
        }
    
    console.info("Random move");
    
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

function is_close_pawn11(position)
{
    const column = position[0] - 1;
    const index = parseInt(position[1]);
    if(column > 0)
    {
        if(index > 0)      
            if(map[column][index - 1] == 11)
                return true;
        
        if(index < 7)
            if(map[column][index + 1] == 11)
                return true;
    }
    return false; 
}

async function AI(map, possibleMoves) {
    try {
        // Input validation
        const prompt = `Twój zadaniem jest grać czarnymi w szachy.
        Szachownica jest reprezentowana jako tabela w tabeli, gdzie każdy element to liczba dwucyfrowa:
        - Pierwsza cyfra oznacza kolor (1 - biały, 2 - czarny).
        - Druga cyfra oznacza figurę (0 - puste, 1 - pion, 2 - goniec, 3 - skoczek, 4 - wieża, 5 - hetman, 6 - król).

        Dostępne ruchy mają trzy wartości:
        1. Siła ruchu (1-10, im wyższa, tym lepszy ruch według heurystyki).
        2. Pozycja figury na planszy (np. [8, 1]).
        3. Docelowa pozycja ruchu (np. [6, 0]).

        Twoim zadaniem jest wybranie najlepszego ruchu i zwrócenie go w formacie [[start_x, start_y], [end_x, end_y]].

        Pamiętaj o podstawowych zasadach gry w szachy, takich jak:
        - Ruchy poszczególnych figur.
        - Zasady bicia figur.
        - Zasady roszady (jeśli chcesz, żeby była brana pod uwagę).
        - Zasady pata i mata.

        W przypadku remisu, wybierz pierwszy ruch z listy dostępnych ruchów.

        Szachownica: ${JSON.stringify(map)}

        **Wybierz JEDEN ruch WYŁĄCZNIE z poniższej listy dostępnych ruchów i zwróć go w podanym formacie.**
        Jeśli żaden z dostępnych ruchów nie jest możliwy do wykonania (np. z powodu zasad szachów), zwróć [[0, 0], [0, 0]].

        Dostępne ruchy: ${JSON.stringify(possibleMoves)}

        Nie pisz dodatkowych opisów ani tekstu.
        Odpowiedź powinna zawierać wyłącznie listę z jednym elementem, reprezentującym wybrany ruch w formacie [[start_x, start_y], [end_x, end_y]].`;
        const apiToken = CONFIG.API_KEY
        
        if (!apiToken) {
            console.error('API token not provided');
            return false;
        }
        
        // Initialize the API
        const genAI = new GoogleGenerativeAI(apiToken);
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-2.0-flash'
        });

        // Create chat session
        const chat = model.startChat({
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
            },
            history: [],
        });

        // Send the actual prompt
        let response;
        try {
            const result = await chat.sendMessage(prompt);
            response = await result.response;
        } catch (error) {
            console.error('Error sending prompt:', error.message);
            return false;
        }
        return response.text().replaceAll("`","").replace("json","");

    } catch (error) {
        console.error('Error generating story:', error.message);
        return false;
    }
}

function convert_position(map, position)
{
    try{
        position = JSON.parse(position);
    } catch {
        return false
    }

    let pos_from, pos_to;
    if(typeof position == "object") {
        pos_from = position[0].join("");
        pos_to = position[1].join("");
    } else {
        pos_from = position[0];
        pos_to = position[1];
    }


    if(pos_from.length != 2 || pos_to.length != 2)
        return false
    
    if(pos_from[0] < 1 || pos_from[0] > 8 || pos_from[1] < 0 || pos_from[1] > 7)
        return false

    const pawn = map[parseInt(pos_from[0])][parseInt(pos_from[1])]
    if(pawn == 0 || pawn.toString()[0] != 2)
        return false

    const target = map[parseInt(pos_to[0])][parseInt(pos_to[1])]

    if (target.toString()[0] == 2)
        return false
    
    return [pos_from, pos_to]
}