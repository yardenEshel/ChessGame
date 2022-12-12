
const container = document.getElementById("gameDiv");
const menu = document.getElementsByClassName("optionsDiv");
var chosenCell = null;
var whiteToMove = true;
function populate(size){
    var isWhite =  true;
    for(let i=0;i<size;i++)
    {
        const div = document.createElement("div");
        div.classList.add("cell");
        div.style.backgroundSize = "94% 94%";
        div.style.boxSizing =  "border-box";
        div.style.backgroundPosition = "center";
        div.style["--boardIndex"] =  i;
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
    var isLegal = true;
    if(chosenCell != this && chosenCell!= null && chosenCell.style.backgroundImage != '')//only real pieces can move
    {
        let backgroundPng = chosenCell.style.backgroundImage;

        if(whiteToMove && backgroundPng.includes('/w_') || !whiteToMove && backgroundPng.includes("/b_"))//one color can move at a time
        {
            chosenCell.style.zIndex = "0";
            chosenCell.style.border = "";
            chosenCell.style.margin =  "0px";
            this.style.zIndex = "0";
            if(backgroundPng.includes('pawn'))
            {
                isLegal = pawnMoveCheck(chosenCell,this);
            }
            if(isLegal)
            {
                this.style.backgroundImage = chosenCell.style.backgroundImage;
                chosenCell.style.backgroundImage = "";
                whiteToMove = !whiteToMove;
            }
            chosenCell = null;
            
        }
        else//reset when a wrongg color has been chosen
        {
            
            chosenCell.style.zIndex = "0";
            chosenCell.style.zIndex = "0";
            chosenCell.style.border = "";
            chosenCell.style.margin =  "0px";
            chosenCell = null;

        }
        
    }
    else if(this.style.backgroundImage && chosenCell != this)//able to change selection
    {
        this.style.border = "5px solid yellow";
        this.style.margin =  "-5px";
        this.style.zIndex = "999";
        chosenCell = this;
    }
    else
    {
        chosenCell = null;
        this.style.zIndex = "0";
        this.style.zIndex = "0";
        this.style.border = "";
        this.style.margin =  "0px";
    }
}
function  pawnMoveCheck(location, destination)//checks if the pawn can move or if its and illegal move
{
    let position = parseInt(location.style["--boardIndex"],10);
    let future = parseInt(destination.style["--boardIndex"],10);
    let pieceOnDest = destination.style.backgroundImage;
    if(whiteToMove)
    {
         if(position == future - 8 && pieceOnDest == "")// white regular move + checks if there is already someone there
         {
            return 1;
         }
         else if (position <= 15 && position == future - 16 && pieceOnDest == "" && container.childNodes[position + 8].style.backgroundImage == '')// white double move + checks if there is someone in his way
         {
            
            return 1;
         }
         else if(pieceOnDest.includes("/b_")&& (position == future - 9 || position == future - 7))// white pawn eat left or right
         {
            return 1;
         }
         else
         {
            return 0;
         }

    }
    else //same with black!
    {
        if(position == future + 8 && pieceOnDest == "")
         {
            return 1;
         }
         else if (position >= 48 && position == future + 16 && pieceOnDest == "" && container.childNodes[position - 8].style.backgroundImage == '')
         {
            return 1;
         }
         else if(destination.style.backgroundImage.includes("/w_")&& (position == future + 9 || position == future + 7))
         {
            return 1;
         }
         else
         {
            return 0;
         }
    }
   
}