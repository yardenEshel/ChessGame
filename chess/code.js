
// console.log("running");
// var cellID = 1;
// let container = document.getElementById("gameDiv");

// for(i=0;i<64;i++)
// {
//     let cell = document.createElement("div");
//     cell.innerHTML = toString(cellID);
//     cellID.id = "cell"+ i;
//     cellID++;
//     container.appendChild(cell);
    
// }
const container = document.getElementById("gameDiv");
function populate(size){
    var isWhite =  true;
    for(let i=0;i<size;i++)
    {
        const div = document.createElement("div");
        div.classList.add("cell");
        div.style.backgroundSize = "cover";
        div.style.boxSizing =  "border-box";
        div.style.backgroundPosition = "right";

        if((i) % 8 == 0)
        {
            isWhite =!isWhite
        }
        if(isWhite)
        {
            div.style.backgroundColor = ("rgb(0,0,0)");
        }
        else
        {
            div.style.backgroundColor = ("#ffff");

        }
        isWhite = !isWhite;
        container.appendChild(div);
        
        


    }
    const startList = ["rook","knight","bishop","queen","king","bishop","knight","rook","pawn","pawn","pawn","pawn","pawn","pawn","pawn","pawn"];
    for(let i = 0;i < 16;i++)
    {
        container.childNodes[i].style.backgroundImage = "url('images/chess-pieces/w_"+startList[i]+"_2x.png')";
        container.childNodes[size-1-i].style.backgroundImage = "url('images/chess-pieces/b_"+startList[i]+"_2x.png')";
        if(startList[i] = "pawn")
        {
            // container.childNodes[i].style.backgroundOrigin = "content-box";
            // container.childNodes[size-1-i].style.backgroundOrigin = "content-box";
        }
    }

}

populate(64);

