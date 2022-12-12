
const container = document.getElementById("gameDiv");
var chosenCell = null;
var zOrder = null;
function populate(size){
    var isWhite =  true;
    for(let i=0;i<size;i++)
    {
        const div = document.createElement("div");
        div.classList.add("cell");
        div.style.backgroundSize = "94% 94%";
        div.style.boxSizing =  "border-box";
        div.style.backgroundPosition = "center";
        div.addEventListener('click',cellClick);

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
        container.childNodes[i].style.backgroundImage = "url('images/chess-pieces/w_"+ startList[i] +"_2x.png')";
        container.childNodes[size-1-i].style.backgroundImage = "url('images/chess-pieces/b_"+ startList[i] +"_2x.png')";
    }

}


populate(64);

function cellClick()
{
    if(chosenCell != this)
    {
        if(chosenCell != null)
        {
            chosenCell.style.zIndex = "0";
            chosenCell.style.border = "none";
            chosenCell.style.margin =  "0px";
            this.style.zIndex = "0";
        }
        chosenCell = this;
        this.style.border = "5px solid yellow";
        this.style.margin =  "-5px";
        zOrder = this.style.zIndex;
        this.style.zIndex = "999";
    }
    else
    {
        chosenCell = null;
        this.style.zIndex = "0";
        this.style.zIndex = "0";
        this.style.border = "none";
        this.style.margin =  "0px";

    }
}