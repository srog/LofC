
class GameBoardLogic {

    isLegalMove(sourceSquare, destinationSquare) {
        var xSelected = parseInt(sourceSquare / 10);
        var ySelected = sourceSquare % 10;
        var xDestination = parseInt(destinationSquare / 10);
        var yDestination = destinationSquare % 10;
    
        if ((xSelected === xDestination) && (ySelected === yDestination)) {
        return false;
        }
    
        if (Math.abs(xSelected - xDestination) < 2 && Math.abs(ySelected - yDestination) < 2) {
        return true;
        }
    
        return false;
    }
}

export default GameBoardLogic;