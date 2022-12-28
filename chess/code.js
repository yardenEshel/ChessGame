
const container = document.getElementById("gameDiv");
const menu = document.getElementsByClassName("optionsDiv");
var chosenCell = null;
var whiteToMove = true;
var isCheck = false;
var checkMate = false;
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
    executeGameOver();
    if(!checkMate)
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
                isLegal = pieceFunc(backgroundPng,chosenCell,this);
                if(isLegal && checkCheck(parseInt(chosenCell.style["--boardIndex"],10),parseInt(this.style["--boardIndex"],10)))
                {
                    this.style.backgroundImage = chosenCell.style.backgroundImage;
                    chosenCell.style.backgroundImage = "";
                    
                    if(isCheck)
                    {
                        if(isCheckMate())
                        {
                            checkMate = true;
                            executeGameOver();
                        }
                        isCheck = false;
                    }

                    whiteToMove = !whiteToMove;
                }

                else
                {
                    chosenCell.style.zIndex = "999";
                    chosenCell.style.border = "5px solid red";
                    chosenCell.style.margin =  "-5px";
                    this.style.setProperty("border", "5px solid red","important");
                    this.style.margin =  "-5px";
                    this.style.zIndex = "999";
                    setTimeout(() => {
                        chosenCell.style.zIndex = "0";
                        chosenCell.style.border = "";
                        chosenCell.style.margin =  "0px";
                        this.style.border = "";
                        this.style.margin =  "0px";
                        this.style.zIndex = "0";
                        chosenCell = null;
                    }, 400);
                    flag = false;
                }
                
                
            }
            else//reset when a wrongg color has been chosen
            {
                
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
}
function pawnMoveCheck(location, destination)//checks if the pawn can move or if its and illegal move
{
    let position = parseInt(location.style["--boardIndex"],10);
    let future = parseInt(destination.style["--boardIndex"],10);
    let pieceOnDest = destination.style.backgroundImage;
    if(whiteToMove)
    {
         if(position == future - 8 && pieceOnDest == "")// white regular move + checks if there is already someone there
         {
            return true;
         }
         else if (position <= 15 && position == future - 16 && pieceOnDest == "" && container.childNodes[position + 8].style.backgroundImage == '')// white double move + checks if there is someone in his way
         {
            
            return true;
         }
         else if(pieceOnDest.includes("/b_")&& (position == future - 9 || position == future - 7))// white pawn eat left or right
         {
            return true;
         }
         else
         {
            return false;
         }

    }
    else //same with black!
    {
        if(position == future + 8 && pieceOnDest == "")
         {
            return true;
         }
         else if (position >= 48 && position == future + 16 && pieceOnDest == "" && container.childNodes[position - 8].style.backgroundImage == '')
         {
            return true;
         }
         else if(pieceOnDest.includes("/w_")&& (position == future + 9 || position == future + 7) && destination.style.backgroundColor == location.style.backgroundColor)
         {
            return true;
         }
         else
         {
            return false;
         }
    }
   
}
function knightMoveCheck(location,destination)
{
    let position = parseInt(location.style["--boardIndex"],10);
    let future = parseInt(destination.style["--boardIndex"],10);
    let pieceOnDest = destination.style.backgroundImage;
    let colorCheck = (whiteToMove && pieceOnDest.includes('/b_') || !whiteToMove && pieceOnDest.includes("/w_") || pieceOnDest == "");//checks
    let moveCheckPositive = (future == position + 6|| future == position + 10 || future == position + 17 || future == position + 15);//checks
    let moveCheckNegative = (future == position - 6|| future == position - 10 || future == position - 17 || future == position - 15);//checks
    let x = (future)%8
    let y = (position)%8
    let hacks = (((x == 0 || x == 1) && y > 6 )|| ((x == 6 || x == 7 )&& y < 2));

    if(colorCheck && (moveCheckNegative||moveCheckPositive) && !hacks)
    {
        return true;
    }
    else
    {
        return false;
    }
}
function bishopMoveCheck(location,destination)
{
    let position = parseInt(location.style["--boardIndex"],10);// location in number/64
    let future = parseInt(destination.style["--boardIndex"],10);// destination in number/64
    let pieceOnDest = destination.style.backgroundImage; //if "" = no piece, if not then theres a piece there
    let colorCheck = (whiteToMove && pieceOnDest.includes('/b_') || !whiteToMove && pieceOnDest.includes("/w_") || pieceOnDest == "");//checks
    let diagonalAngle = 0;
    let moveCheck = ((future - position) %  9 == 0 || (future - position) %  7 == 0);//check that the bishop move diagonaly
    
    if(colorCheck && moveCheck && destination.style.backgroundColor == location.style.backgroundColor)
    {
        if((future - position) %  9 == 0)
        {
            diagonalAngle = ((future - position)/Math.abs(future-position))*9;
            

        }
        else
        {
            diagonalAngle = ((future - position)/Math.abs(future-position))*7;
        }
        if(!diagonalAngle)
            {
                diagonalAngle = 0;
            }
        for(let i = position + diagonalAngle; i != future; i+= diagonalAngle)
        {
            if(container.childNodes[i].style.backgroundImage != "")
            {
                return false;
            }
        }
        return true;
    }
    else
    {
        return false;
    }
}
function rookMoveCheck(location,destination)
{
    let position = parseInt(location.style["--boardIndex"],10);// location in number/64
    let future = parseInt(destination.style["--boardIndex"],10);// destination in number/64
    let pieceOnDest = destination.style.backgroundImage; //if "" = no piece, if not then theres a piece there
    let colorCheck = (whiteToMove && pieceOnDest.includes('/b_') || !whiteToMove && pieceOnDest.includes("/w_") || pieceOnDest == "");//checks
    let horOrVert = 0;
    let moveCheck = ((future - position) %  8 == 0 || ((future/8) | 0) == ((position/8)| 0 ));//check that the rook moves straight
    
    if(colorCheck && moveCheck)
    {
        if(Math.abs(future - position) < 8)
        {
            diagonalAngle = ((future - position)/Math.abs(future-position));
        }
        else
        {
            diagonalAngle = ((future - position)/Math.abs(future-position))*8;
        }
        if(!diagonalAngle)
        {
            diagonalAngle = 0;
        }
        for(let i = position + diagonalAngle; i != future; i+= diagonalAngle)
        {
            if(container.childNodes[i].style.backgroundImage != "")
            {
                return false;
            }
        }
        return true;
    }
    else
    {
        return false;
    }
}

function kingMoveCheck(location, destination)//checks if the king can move or if its an illegal move
{
    let position = parseInt(location.style["--boardIndex"],10);
    let future = parseInt(destination.style["--boardIndex"],10);
    let pieceOnDest = destination.style.backgroundImage;
    let updownValid = position == future - 8 || position == future + 8;
    let colorCheck = (whiteToMove && pieceOnDest.includes('/b_') || !whiteToMove && pieceOnDest.includes("/w_") || pieceOnDest == "")
    let diagonalValid = (Math.abs(position - future) == 7 || Math.abs(position - future) == 9) && destination.style.backgroundColor == location.style.backgroundColor;
    let sideValid = ((position)/8 | 0) == ((future)/8 | 0) && Math.abs(position - future) == 1;
    if( (updownValid || diagonalValid || sideValid) && colorCheck)
    {
        return true;
    }
    return false;
}
function checkCheck(origin,endin)
{
    let copyCat = container.childNodes;
    let semi = copyCat[endin].style.backgroundImage;
    copyCat[endin].style.backgroundImage = copyCat[origin].style.backgroundImage;
    copyCat[origin].style.backgroundImage = "";
    let kings = findKing();
    let isPossible = false;
    if(kings[0] == 64 || kings[1] == 64)
    {
        throw kings;
    }

    

    for(let i = 0; i < 64; i++)
    {
        let piece = copyCat[i].style.backgroundImage;
        if((whiteToMove) && piece != "")
        {
            if(piece.includes("/b_"))
            {
                whiteToMove = !whiteToMove;
                isPossible = pieceFunc(piece,copyCat[i],copyCat[kings[0]]);
                whiteToMove = !whiteToMove;
            }
            else
            {
                if(pieceFunc(piece, copyCat[i],copyCat[kings[1]])){isCheck = true;}
            }
            
        }
        else if(!whiteToMove && piece != "")
        {
            if(piece.includes("/w_"))
            {
                whiteToMove = !whiteToMove;
                isPossible = pieceFunc(piece,copyCat[i],copyCat[kings[1]]);
                whiteToMove = !whiteToMove;
            }
            else
            {
                if(pieceFunc(piece, copyCat[i],copyCat[kings[0]])){isCheck = true;}
            }
        }
        if(isPossible)
        {
            copyCat[origin].style.backgroundImage = copyCat[endin].style.backgroundImage;
            copyCat[endin].style.backgroundImage = semi;
            return false;
        }
    }
    copyCat[origin].style.backgroundImage = copyCat[endin].style.backgroundImage;
    copyCat[endin].style.backgroundImage = semi;
    return true;



}
function pieceFunc(backgroundPiece,chosenCell,thisCell)//get what piece wants to move and returnt true if legal
{
        if(backgroundPiece.includes('pawn'))
        {
            return pawnMoveCheck(chosenCell,thisCell);
        }
        else if(backgroundPiece.includes('knight'))
        {
            return knightMoveCheck(chosenCell,thisCell);
        }
        else if(backgroundPiece.includes('bishop'))
        {
           return bishopMoveCheck(chosenCell,thisCell);
        }
        else if(backgroundPiece.includes('rook'))
        {                
            return rookMoveCheck(chosenCell,thisCell);
        }
        else if(backgroundPiece.includes('queen'))
        {
            return (rookMoveCheck(chosenCell,thisCell) || bishopMoveCheck(chosenCell,thisCell));
        }
        else if(backgroundPiece.includes('king'))
        {
            return kingMoveCheck(chosenCell,thisCell);
        }
}

function isCheckMate()
{
    
    let isPossible = false;
    for(let i = 0; i < 64; i++)
    {
        if((!whiteToMove && container.childNodes[i].style.backgroundImage.includes('/w_')) || (whiteToMove && container.childNodes[i].style.backgroundImage.includes("/b_")))
        {
            for(let j = 0; j < 64; j++)
            {
                if(j != i)
                {
                    whiteToMove = !whiteToMove;
                    isPossible = pieceFunc(container.childNodes[i].style.backgroundImage,container.childNodes[i],container.childNodes[j]);
                    whiteToMove = !whiteToMove;
                    if(isPossible)
                    {
                        try {
                            whiteToMove = !whiteToMove;
                            if(checkCheck(i,j))
                            {
                                whiteToMove = !whiteToMove;
                                return false;
                            }
                            whiteToMove = !whiteToMove;


                        }
                        catch (error) 
                        {
                            let x = 0;
                        }
                        


                    }
                    isPossible = false;
                }

            }

        }
    }
    return true;
}

function findKing()
{
    var black = 64;
    var white = 64;
    let piece = null;
    for(let i=0; (black == 64 || white == 64) && i < 64;i++)
    {
        piece = container.childNodes[i];
        if(piece.style.backgroundImage.includes("w_king"))
        {
            white = piece.style['--boardIndex'];
        }
        if(piece.style.backgroundImage.includes("b_king"))
        {
            black = piece.style['--boardIndex'];
        }
    }
    return [white,black];
}
function executeGameOver()
{
    setTimeout(() => 
    {
        const div = document.createElement("div");
        div.setAttribute("id","checkMateMsg");
        div.innerHTML = "game over";
        document.getElementsByClassName("webPage")[0].appendChild(div);
    }
    , 0);
}