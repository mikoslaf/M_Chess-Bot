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
let move = 1 // 1 - player, 2 - bot/black player
let clicked_position = 0;
let players = false;
let is_check = false;
let w_king_position = "14";
let b_king_position = "84";
let w_castling = [1,1] 
let b_castling = [1,1] 
let flagged = []

$(function() {

    for(let i=8;i>0;i--)
    {
        $.each(map[i],(j, val) => {
            if (val != 0)
            {
                $(".contener").children(".field").eq(8 * (8 - i) + j).addClass("a"+val);
            }
        });
    }
    // for(let i=8;i>0;i--)
    // {
    //     $.each(map_ab[i],(j, val) => {
    //             $(".contener").children(".field").eq(8 * (8 - i) + j).html(val);
    //     });
    // }
    $(".field").on("click", (e) => {
        const id = e.target.id;
        if(id == ""){
            move_pawn(e.target.className[0] + e.target.className[1])
        }
        else 
        {
            const pawn = map[id[0]][parseInt(id[1].charCodeAt(0)) - 65];  
            console.log(pawn + " | " + id);
            if(players)
            {
                if(pawn.toString()[0] == move)
                    move_option(pawn.toString(), id); 
            }
            else 
            {
                //if(move == 1) -- change this later
                    move_option(pawn.toString(), id); 
            }
        }
    });

    $(".2players").on("click", () => {
        players = true
        for(let i = 1; i < 7; i++)
            $(".a2"+i).css({"transform": "rotateX(180deg)"});
    });

    $(".Game").on("click", () => {
        for(let i=8;i>0;i--)
        {
            $.each(map_aw[i],(j, val) => {
                    $(".contener").children(".field").eq(8 * (8 - i) + j).html(val);
            });
        }
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

        players = false
        w_king_position = "14";
        b_king_position = "84";
        w_castling = [1,1] 
        b_castling = [1,1] 
        move = 1

        for(let i = 1; i < 7; i++)
            $(".a2"+i).css({"transform": "rotateX(0deg)"});

        let color = "white"

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

function check_check(position) 
{

}

function change_position(pawn, position, val = 1) 
{
    const positions = move_option(pawn, position[0]+String.fromCharCode(parseInt(position[1]) + 65), true)
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
    const positions_check = move_option("15", position[0]+String.fromCharCode(parseInt(position[1]) + 65), true)
    let found = []
    $.each(positions_check, function (_, value) { 
        const poz = map[value[0]][value[1]].toString()
        if((poz[1] == 5 || poz[1] == 2 || poz[1] == 4) && !changed.includes(value))
        {   
            found.push(value)
            const positions_delete = move_option(poz, value[0]+String.fromCharCode(parseInt(value[1]) + 65), true)
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
        const positions_add = move_option(pawn, value[0]+String.fromCharCode(parseInt(value[1]) + 65), true)
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

function move_pawn(position) 
{
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

    console.log(changed2)

    if(pawn == 11 && position[0] == 8) pawn = 15
    if(pawn == 21 && position[0] == 1) pawn = 25
    map[position[0]][position[1]] = pawn;

    console.log(changed.concat(changed2).splice( $.inArray(position, changed) ,1 ))
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
            move_pawn("13")
        }
        else if(position == 16 && w_castling[1] == 1)
        {
            clicked_position = "17"
            move_pawn("15")
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
            move_pawn("83")
        }
        else if(position == 86 && b_castling[1] == 1)
        {
            clicked_position = "87"
            move_pawn("85")
        }
        b_castling = false 
    }

    if(players)
    {
        if(pawn.toString()[0] == "2")
        {
            $(".a"+pawn).css({"transform": "rotateX(180deg)"}); 
        }
    }

    clicked_position = 0
    if(move == 1) 
        move = 2
    else 
        move = 1

    for(let i=8;i>0;i--)
    {
        $.each(map_aw[i],(j, val) => {
                $(".contener").children(".field").eq(8 * (8 - i) + j).html(val);
        });
    }
    show_options()
}

function move_option(pawn, localization, Wreturn = false) 
{
    let tocheck = []
    let index = localization[1].charCodeAt(0) - 65;
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
            if(!Wreturn)
            {
                if(pawn[0] == "1")
                {
                    if(w_castling[0] == 1 && map[1][1] == 0 && map[1][2] == 0 && map[1][3] == 0)
                    {
                        options2.push("12")
                    }
                    if(w_castling[1] == 1 && map[1][5] == 0 && map[1][5] == 0)
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
                    if(b_castling[1] == 1 && map[8][5] == 0 && map[8][5] == 0)
                    {
                        options2.push("86")
                    }
                }
            }


            if(pawn[0] == "1" &&  map_ab[localization[0]][index] != 0)
            {
                map[localization[0]][index] = 0
                const positions_check = move_option("15", localization, true)
                $.each(positions_check, function (_, value) { 
                    const poz = map[value[0]][value[1]].toString()
                    if((poz[1] == 5 || poz[1] == 2 || poz[1] == 4) && poz[0] == 2)
                    {   
                        const positions_delete = move_option(poz, value[0]+String.fromCharCode(parseInt(value[1]) + 65), true)
                        tocheck = options2.filter(value => !positions_delete.includes(value));
                    }
                });
                map[localization[0]][index] = 16
            }
            else if(pawn[0] == "2" && map_aw[localization[0]][index] != 0)
            {
                map[localization[0]][index] = 0
                const positions_check = move_option("25", localization, true)
                $.each(positions_check, function (_, value) { 
                    const poz = map[value[0]][value[1]].toString()
                    if((poz[1] == 5 || poz[1] == 2 || poz[1] == 4) && poz[0] == 1)
                    {   
                        const positions_delete = move_option(poz, value[0]+String.fromCharCode(parseInt(value[1]) + 65), true)
                        tocheck = options2.filter(value => !positions_delete.includes(value));
                    }
                });
                map[localization[0]][index] = 26
            }
            else
            {
                tocheck = options2
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
                if(localization[0] == 2 && map[parseInt(localization[0]) + 2][index] == 0) tocheck.push(parseInt(localization[0]) + 2 + index.toString());
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
                if(localization[0] == 7 && map[parseInt(localization[0]) - 2][index] == 0) tocheck.push(localization[0] - 2 + index.toString());
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
    if(Wreturn)
        return tocheck

    clicked_position = parseInt(localization[0]) + index.toString()
    show_options(tocheck)
}

function show_options(options = []) 
{
    flagged.forEach(element => {
        $("#"+element[0]+String.fromCharCode(parseInt(element[1]) + 65)).html(); // add ""
    });

    flagged = options
    options.forEach(element => {
        if(map[element[0]][element[1]] != 0) 
        {
            $("#"+element[0]+String.fromCharCode(parseInt(element[1]) + 65)).html("<div class='"+element+" flag'>"+element[0]+String.fromCharCode(parseInt(element[1]) + 65)+"</div>"); 
        } 
        else 
        {
            $("#"+element[0]+String.fromCharCode(parseInt(element[1]) + 65)).html("<div class = '"+element+"'>"+element[0]+String.fromCharCode(parseInt(element[1]) + 65)+"</div>");  
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