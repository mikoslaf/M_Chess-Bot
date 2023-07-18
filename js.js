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



$(function() {

    for(let i=8;i>0;i--)
    {
        console.log(i)
        $.each(map[i],(j, val) => {
            if (val != 0)
            {
                $(".contener").children(".field").eq(8 * (8 - i) + j).addClass("a"+val);
            }
        });
    }

    $(".field").on("click", (e) => {
        const id = e.target.id;
        const pawn = map[id[0]][parseInt(id[1].charCodeAt(0)) - 65];  
        //const index = parseInt(id[0]) + parseInt(id[1].charCodeAt(0)) - 65
        console.log(pawn + " | " + id);
        move_option("25", id);
    });
});

function move_option(pawn, localization) 
{
    let tocheck = []
    //if(pawn[1] != 1) pawn = pawn[0];
    let index = localization[1].charCodeAt(0) - 65;
    switch(parseInt(pawn[1])) 
    {
        case 6:
            let index6 = localization[1].charCodeAt(0);
            if(localization[0] != 8) 
            {
                tocheck.push(parseInt(localization[0]) + 1 + (index6 - 65).toString());
            }
            if(localization[0] != 1) 
            {
                tocheck.push(localization[0] - 1 + (index6 - 65).toString()); 
            }
            if(index6 != 65)
            {
                const down = (index6 - 66).toString();
                tocheck.push(localization[0] + down);
                if(localization[0] != "8")  tocheck.push(parseInt(localization[0]) + 1 + down);
                if(localization[0] != "1")  tocheck.push(localization[0] - 1 + down);
            }
            if(index6 != 72)
            {
                const up = (index6 - 64).toString(); 
                tocheck.push(localization[0] + up);
                if(localization[0] != "8")  tocheck.push(parseInt(localization[0]) + 1 + up);
                if(localization[0] != "1")  tocheck.push(localization[0] - 1 + up);
            }
            break;
        case 4:
            for (let i = 0; i < index; i++) {
                tocheck.push(localization[0] + i);
            }
            for (let i = index + 1; i < 8; i++) {
                tocheck.push(localization[0] + i);
            }
            for (let i = 1; i < parseInt(localization[0]); i++) {
                tocheck.push(i + index.toString());
            }
            for (let i = parseInt(localization[0]) + 1; i <= 8; i++) {
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
                        tocheck.push(element)
            });
            break;
        case 5:
            for (let i = 0; i < index; i++) {
                tocheck.push(localization[0] + i);
            }
            for (let i = index + 1; i < 8; i++) {
                tocheck.push(localization[0] + i);
            }
            for (let i = 1; i < parseInt(localization[0]); i++) {
                tocheck.push(i + index.toString());
            }
            for (let i = parseInt(localization[0]) + 1; i <= 8; i++) {
                tocheck.push(i + index.toString());
            }
        case 2:
            for (let i = 1; i < 8; i++) {
                if(localization[0] - i >= 0 && index - i >= 0)
                    tocheck.push(localization[0] - i + (index - i).toString());
            }
            for (let i = 1; i < 8; i++) {
                if(localization[0] - i >= 0 && index + i <= 8)
                    tocheck.push(localization[0] - i + (index + i).toString());
            }
            for (let i = 1; i < 8; i++) {
                if(parseInt(localization[0]) + i <= 8 && index + i <= 8)
                    tocheck.push(parseInt(localization[0]) + i + (index + i).toString());
            }
            for (let i = 1; i < 8; i++) {
                if(parseInt(localization[0]) + i <= 8 && index - i >= 0)
                    tocheck.push(parseInt(localization[0]) + i + (index - i).toString());
            }
            break;
        case 1:
            if(pawn[0] == "1")
            {
                tocheck.push(parseInt(localization[0]) + 1 + index.toString());
                tocheck.push(parseInt(localization[0]) + 1 + (index - 1).toString());
                tocheck.push(parseInt(localization[0]) + 1 + (index + 1).toString());
            } 
            else
            {
                tocheck.push(localization[0] - 1 + index.toString());
                tocheck.push(localization[0] - 1 + (index - 1).toString());
                tocheck.push(localization[0] - 1 + (index + 1).toString());
            }
            break;
    }
    console.log(tocheck)
    show_options(tocheck)
}
let flagged = []
function show_options(check) 
{
    flagged.forEach(element => {
        $("#"+element[0]+String.fromCharCode(parseInt(element[1]) + 65)).removeClass("flagged");
    });

    flagged = check
    check.forEach(element => {
        $("#"+element[0]+String.fromCharCode(parseInt(element[1]) + 65)).addClass("flagged");
    });
}