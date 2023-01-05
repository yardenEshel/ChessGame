
const container = document.getElementById("gameDiv");//board
const menu = document.getElementsByClassName("optionsDiv");//menu
const whole = document.getElementById("message");//queening window
const pl = document.getElementsByClassName("pieceLost");//pieces lost div
var chosenCell = null;
var whiteToMove = true;
var isCheck = false;
var checkMate = false;
var w_iskingRookMove = false;
var b_iskingRookMove = false;
var lastMove = [null,null,null,null,null,null];
var boardEnd = false;
var freeze = false;
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
            div.style.backgroundColor = ("rgb(0,0,0,0.5)");
        }
        else
        {
            div.style.backgroundColor = ("rgb(255,255,255,0.5)");
        }
        isWhite = !isWhite;
        container.appendChild(div);
    }
    let kq = false;
    const startList = ["rook","knight","bishop","king","queen","bishop","knight","rook","pawn","pawn","pawn","pawn","pawn","pawn","pawn","pawn"];
    for(let i = 0;i < 16;i++)
    {
        container.childNodes[i].style.backgroundImage = "url('images/chess-pieces/w_"+ startList[i] +"_2x.png')";
        container.childNodes[size-1-i].style.backgroundImage = "url('images/chess-pieces/b_"+ startList[i] +"_2x.png')";
    }
    let tempo = container.childNodes[60].style.backgroundImage;
    container.childNodes[60].style.backgroundImage = container.childNodes[59].style.backgroundImage;
    container.childNodes[59].style.backgroundImage = tempo;
    piecesLostDivCreator()

}


populate(64);

function cellClick() 
{
    lastMove[5] = null;
    if(!checkMate || freeze)
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
                    lastMoveMaker(chosenCell,this)//update last move.
                    if(boardEnd && (parseInt(chosenCell.style["--boardIndex"],10)>47 ||parseInt(chosenCell.style["--boardIndex"],10)<16))//pawn reached last row?
                    {
                        freeze = true;//cant touch anything. only after choosing a piece to replace pawn.
                        queening();
                    }
                    boardEnd = false;
                    this.style.backgroundImage = chosenCell.style.backgroundImage;
                    chosenCell.style.backgroundImage = "";
                    if((backgroundPng.includes("w_king")||backgroundPng.includes("w_rook"))&& w_iskingRookMove == false)
                    {
                        w_iskingRookMove = true;
                    }
                    if((backgroundPng.includes("b_king")||backgroundPng.includes("b_rook"))&& b_iskingRookMove == false)
                    {
                        b_iskingRookMove = true;
                    }
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
function pawnMoveCheck(location, destination)//validate pawn's movement + if reached the end of the board
{
    let position = parseInt(location.style["--boardIndex"],10);
    let future = parseInt(destination.style["--boardIndex"],10);
    let pieceOnDest = destination.style.backgroundImage;
    if(whiteToMove)
    {
         if(position == future - 8 && pieceOnDest == "")// white regular move + checks if there is already someone there
         {
            if(future>55)
            {
                boardEnd = true;
                lastMove[5] = 4;
            }
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
         else if(lastMove[0] == null)
         {
            return false;
         }
         else if((position == future - 9 || position == future - 7) && JSON.stringify(lastMove.slice(0,3)) == JSON.stringify([false,"pawn",future - 8])&& future<48)
         {
            container.childNodes[lastMove[2]].style.backgroundImage = "";
            lastMove[5] = 1
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
            if(future<8)
            {
                boardEnd = true;
                lastMove[5] = 4;
            }
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
         else if(lastMove[0] == null)
         {
            return false;
         }
         else if((position == future + 9 || position == future + 7) && JSON.stringify(lastMove.slice(0,3)) == JSON.stringify([true,"pawn",future + 8])&& future>15)
         {
            container.childNodes[lastMove[2]].style.backgroundImage = "";
            lastMove[5] = 1
            return true;
         }
         else
         {
            return false;
         }
    }
   
}
function knightMoveCheck(location,destination)//validate knight's movement
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
function bishopMoveCheck(location,destination)//validate bishops's movement
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
function rookMoveCheck(location,destination)//validate rook's movement
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
    else if(position == future - 2|| position == future + 2)
    {
        return castleCheck(position,future);
    }
    return false;
}
function checkCheck(origin,endin)//checks: 1 - if your king is in check, 2- if the opponent king is in check
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
function isCheckMate()//checks if any king is in checkmate.
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
function findKing()//finds postion of both kings in any given time
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
function executeGameOver()// creating div for "game over"
{
    
    const gameOverMsg= document.getElementById("checkmate");
    gameOverMsg.style.visibility = "visible";
}
function castleCheck(current,future)//checks if castling is possible + moves the rook(the king will move later)
{
    if(w_iskingRookMove && b_iskingRookMove)
    {
        return false
    }
    let i = 0;
    let counter = future - current;//checks if the way is clear for castling, and if none of the cells is threatened
    let difference = counter/Math.abs(counter);
    let pieces = container.childNodes;
    for(i = current + difference; i != 7 && i > 0 && i < 63 && i != 56 ; i += difference)
    {
        if(pieces[i].style.backgroundImage != ""  )
        {
            return false;
        }
        
    }
    if(!checkCheck(current,current + difference) || !checkCheck(current,current + 2*difference))
    {
        return false;
    }
    pieces[future - difference].style.backgroundImage = pieces[i].style.backgroundImage;
    pieces[i].style.backgroundImage = "";
    if(0<(future - difference))
    {
        lastMove[5] = 3;//queen side
    }
    else{
        lastMove[5] = 2;//king side
    }
    
    return true;
}
function queening()//creating small div aside the board for which the player chooses a piece to replace the pawn.
{
    const menuPawn = document.getElementsByClassName("askPiece");
    
    let cap = "w";
    if(!whiteToMove){cap = "b";}
    let queeningList = ["queen","knight","bishop","rook"];
    for(let i = 0;i<4;i++)
    {
        menuPawn[i].style.backgroundImage = "url('images/chess-pieces/"+cap+"_"+ queeningList[i] +"_2x.png')";
        menuPawn[i].addEventListener("click",pieceChosen);
    }
    whole.style.visibility = "visible";
    
}
function pieceChosen()//applying changes when pawn reaches board's end.
{
    whole.style.visibility = "hidden";
    freeze = false;
    container.childNodes[lastMove[2]].style.backgroundImage = this.style.backgroundImage;
}
function lastMoveMaker(loc,dest)//last move - list - [color that moved,piece that moved,to where,from where, piece that was eaten/null,spaciel moves(en passant - 1,castle - 2 - KINGside/3 - QUEENside,queenin - 4)]
{
    let color = whiteToMove;//color that moved
    let piece1 = loc.style.backgroundImage;
    piece1 = piece1.slice(piece1.indexOf("_")+1,piece1.indexOf("_",piece1.indexOf("_")+1));//piece that moved
    let to = parseInt(dest.style["--boardIndex"],10);//to where
    let from = parseInt(loc.style["--boardIndex"],10);//from where
    let eatenPiece = null;
    if(dest.style.backgroundImage != "")
    {
        eatenPiece = dest.style.backgroundImage;
        eatenPiece = eatenPiece.slice(eatenPiece.indexOf("_")+1,eatenPiece.indexOf("_",eatenPiece.indexOf("_")+1));//eaten piece or null
    }
    if(lastMove[5] == 1)
    {
        eatenPiece ="pawn";
    }
    if(eatenPiece != "" && eatenPiece != null)
    {
        addPieceLost(color,eatenPiece);
    }
    lastMove = [color,piece1,to,from,eatenPiece,lastMove[5]];


}
function piecesLostDivCreator()//creates a div, which shows all lost pieces
{
    let lostList = ["queen","knight","bishop","rook","pawn"];
    for(let i = 0;i<5;i++)
    {
        pl[i+5].style.backgroundImage = "url('images/chess-pieces/w_"+ lostList[i] +"_2x.png')";
        pl[i].style.backgroundImage = "url('images/chess-pieces/b_"+ lostList[i] +"_2x.png')";
    }
}
function addPieceLost(color,pieceToAdd)
{
    let lostList = ["queen","knight","bishop","rook","pawn"];
    let temp = 0;
    if(color != true)
    {
        temp = 5;
    }
    pl[lostList.indexOf(pieceToAdd)+ temp].innerHTML = parseInt(pl[lostList.indexOf(pieceToAdd) + temp].innerHTML)+1;

}