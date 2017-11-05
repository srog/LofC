import React from 'react';
import Square from './square.js'
import EntityDetails from './entityDetails.js'

class Board extends React.Component {
constructor() {
    super();
    this.state = {
      squareContent: Array.apply(null, { length: 70 }).map(function(value, index) { 
        if (index == 0) 
          return '1';
        if (index == 69) 
          return '2';
        if (index == 8) 
          return '3';
        if (index == 1) 
          return '4';
        if (index == 68) 
          return '5';
      }),
      playerTurn: 1,
      selectedSquareId: null,
      isMoving: null,
      moveInfo: null,
      entityKilled: null,
      endOfGameInfo: null,

      entities: {  
        1:{ id: 1, name: 'Player 1',  type: 'creature', image: 'wiz1.jpg', owner: 1, alive: true, ap: 100, attack: 5, defense: 4, resources: []}, 
        2:{ id: 2, name: 'Player 2', type: 'creature', image: 'wiz2.jpg', owner: 2, alive: true, ap: 100, attack: 3, defense: 6, resources: []},
        3:{ id: 3, name: 'Dragon', type: 'creature', image: 'dragon.jpg', owner: 0, alive: true, ap: 100, attack: 9, defense: 7, resources: []},
        4:{ id: 4, name: 'Cash', type: 'resource', image: 'coin.jpg', owner: 0, resources:[], quantity: 5},
        5:{ id: 5, name: 'Cash', type: 'resource', image: 'coin.jpg', owner: 0, resources:[], quantity: 7} }     
    };
    this._onCancelClick = this._onCancelClick.bind(this);
    this._onMoveClick = this._onMoveClick.bind(this);
    this._onNextTurnClick = this._onNextTurnClick.bind(this);
}

_onCancelClick() {
    this.setState({
      selectedSquareId: 'None',
      isMoving: null,
      moveInfo: null,
    });
  }

_onMoveClick() {
    this.setState({ isMoving: 'Moving'});
  }

_onNextTurnClick() {
    var newPlayerTurn = this.state.playerTurn == 1 ? 2 : 1;
    this.setState({ 
      playerTurn: newPlayerTurn,
      isMoving: null,
      moveInfo: null,
      selectedSquareId: null
   });

   this.restoreAllAP();
  }

getEntityFromId(entityId) {
  return this.state.entities[entityId];
}

isEntityAlive(entityId) {
  return this.getEntityFromId(entityId).alive;
}
isEntityCreature(entityId) {
  return this.getEntityFromId(entityId).type == 'creature';
}
isEntityResource(entityId) {
  return this.getEntityFromId(entityId).type == 'resource';
}

moveEntity(destinationSquareId) {
  if (!this.isLegalMove(destinationSquareId)) {
    this.setState({ isMoving: 'Illegal Move!'});
    return;
  }
  
  var newSquareContents = this.state.squareContent;

  var entityIdToMove =  this.state.squareContent[this.state.selectedSquareId];
  var entityIdToAttack = newSquareContents[destinationSquareId]; 
  
  if (entityIdToAttack != null) {
    if (this.isEntityCreature(entityIdToAttack)) {
      // Attack
      this.amendApForEntity(entityIdToMove, -50);
    
      // check for kill
      var killedEntity = null;
      if (true) { killedEntity = entityIdToAttack};

      if (killedEntity != null) {
        this.killEntity(killedEntity)
        this.checkForWinner();
        
        newSquareContents[this.state.selectedSquareId] = null;  
        newSquareContents[destinationSquareId] = entityIdToMove;
        
        this.setState({ 
          squareContent: newSquareContents,
          isMoving: null,
          moveInfo: null,
          entityKilled: killedEntity,
          selectedSquareId: null});
      }
    }
    if (this.isEntityResource(entityIdToAttack)) {
      this.addResourceToEntity(entityIdToMove, entityIdToAttack);
    
      this.amendApForEntity(entityIdToMove, -50);
      
      newSquareContents[this.state.selectedSquareId] = null;  
      newSquareContents[destinationSquareId] = entityIdToMove;
        
      this.setState({ 
        squareContent: newSquareContents,
        isMoving: null,
        entityKilled: null,
        moveInfo: 'Resource Captured!',
        selectedSquareId: null});
    }   

  }
  else {
    // Empty square, so move
    newSquareContents[this.state.selectedSquareId] = null;  
    newSquareContents[destinationSquareId] = entityIdToMove;
  
    this.setState({ 
      squareContent: newSquareContents,
      isMoving: null,
      moveInfo: null,
      entityKilled: null,
      selectedSquareId: null});
      
    this.amendApForEntity(entityIdToMove, -50);

  }
  
  
}

addResourceToEntity(creatureId, resourceId) {
  var newEntities = this.state.entities;
  newEntities[creatureId].resources.push(this.getEntityFromId(resourceId));
  this.setState({ entities: newEntities });
}

isLegalMove(destinationSquareId) {
  var xSelected = parseInt(this.state.selectedSquareId / 10);
  var ySelected = this.state.selectedSquareId % 10;
  var xDestination = parseInt(destinationSquareId / 10);
  var yDestination = destinationSquareId % 10;

  if ((xSelected == xDestination) && (ySelected == yDestination)) {
    return false;
  }

  if (Math.abs(xSelected - xDestination) < 2 && Math.abs(ySelected - yDestination) < 2) {
    return true;
  }

  return false;
}

amendApForEntity(entityId, apChange) {
  var newEntities = this.state.entities;
  newEntities[entityId].ap += apChange;
  this.setState({ entities: newEntities });
}

killEntity(entityId) {
  var newEntities = this.state.entities;
  newEntities[entityId].alive = false;
  this.setState({ entities: newEntities });    
}

restoreAllAP(entity) {
  var newEntities = this.state.entities;
  for(var i=1; i<=4; i++) { newEntities[i].ap = 100; }
  
  this.setState({ entities: newEntities });    
}

checkForWinner() {
  if (!this.isEntityAlive(1)) {
    this.setState({ endOfGameInfo: 'Player 2 Wins!!'});
  }
  if (!this.isEntityAlive(2)) {
    this.setState({ endOfGameInfo: 'Player 1 Wins!!'});
  }
}

handleClick(squareId) {
    if (this.state.endOfGameInfo != null) { return;};
    if (this.state.isMoving != null) {
      this.moveEntity(squareId);
    }
    else {    
      this.setState({ 
        entityKilled: null,
        moveInfo: null,
        selectedSquareId: ( this.state.selectedSquareId != squareId ? squareId : null ) });
    }    
  }

  renderSquare(id) {
    var content = this.state.squareContent[id] == null ? null : this.getEntityFromId(this.state.squareContent[id]).image;
    return <Square id={id} content={content} onClick={() => this.handleClick(id)}  />;
  }

  renderEntityDetail(entity, owner) {
    if (entity == null) {
      return null;
    }

    return <EntityDetails entityOwner={owner} entity={entity} />
  }

  render() {
    const status = ('Player Turn: ' + this.state.playerTurn);
    var entityId = this.state.squareContent[this.state.selectedSquareId];
    
    const killInfo = this.state.entityKilled == null ? null : 'Entity Killed: ' + this.getEntityFromId(this.state.entityKilled).name; 

    var entityIsOwned = false;
    var entity = this.getEntityFromId(entityId);
    var owner = null;

    if (entity != null) {
      entityIsOwned = (this.state.playerTurn == entity.owner);
      owner = this.getEntityFromId(entity.owner);
    }
    
    return (
      <div>
        <div className="status">{status} </div>                

        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
          {this.renderSquare(9)}
        </div>
        <div className="board-row">
          {this.renderSquare(10)}
          {this.renderSquare(11)}
          {this.renderSquare(12)}
          {this.renderSquare(13)}
          {this.renderSquare(14)}
          {this.renderSquare(15)}
          {this.renderSquare(16)}
          {this.renderSquare(17)}
          {this.renderSquare(18)}
          {this.renderSquare(19)}
        </div>
        <div className="board-row">
          {this.renderSquare(20)}
          {this.renderSquare(21)}
          {this.renderSquare(22)}
          {this.renderSquare(23)}
          {this.renderSquare(24)}
          {this.renderSquare(25)}
          {this.renderSquare(26)}
          {this.renderSquare(27)}
          {this.renderSquare(28)}
          {this.renderSquare(29)}
        </div>
        <div className="board-row">
          {this.renderSquare(30)}
          {this.renderSquare(31)}
          {this.renderSquare(32)}
          {this.renderSquare(33)}
          {this.renderSquare(34)}
          {this.renderSquare(35)}
          {this.renderSquare(36)}
          {this.renderSquare(37)}
          {this.renderSquare(38)}
          {this.renderSquare(39)}
        </div>
        <div className="board-row">
          {this.renderSquare(40)}
          {this.renderSquare(41)}
          {this.renderSquare(42)}
          {this.renderSquare(43)}
          {this.renderSquare(44)}
          {this.renderSquare(45)}
          {this.renderSquare(46)}
          {this.renderSquare(47)}
          {this.renderSquare(48)}
          {this.renderSquare(49)}
        </div>
        <div className="board-row">
          {this.renderSquare(50)}
          {this.renderSquare(51)}
          {this.renderSquare(52)}
          {this.renderSquare(53)}
          {this.renderSquare(54)}
          {this.renderSquare(55)}
          {this.renderSquare(56)}
          {this.renderSquare(57)}
          {this.renderSquare(58)}
          {this.renderSquare(59)}
        </div>
        <div className="board-row">
          {this.renderSquare(60)}
          {this.renderSquare(61)}
          {this.renderSquare(62)}
          {this.renderSquare(63)}
          {this.renderSquare(64)}
          {this.renderSquare(65)}
          {this.renderSquare(66)}
          {this.renderSquare(67)}
          {this.renderSquare(68)}
          {this.renderSquare(69)}
        </div>

        {this.renderEntityDetail(entity, owner)}

        <div className="status">{this.state.isMoving}</div>
        <div className="status">{this.state.moveInfo}</div>
        <div className="status">{killInfo}</div>
        <div className="status">{this.state.endOfGameInfo}</div>        

        <div className="button">
          <button name="Cancel" disabled={entityId == null ? 'disabled' : null} onClick={this._onCancelClick}>Cancel</button>
          <button name="Move" disabled={(entityId == null || !entityIsOwned || this.state.isMoving != null || entity.ap < 50) ? 'disabled' : null} onClick={this._onMoveClick}>Move</button>
        </div>
        <button name="EndTurn" onClick={this._onNextTurnClick}>End Turn</button>
      </div>
    );
  }
}

export default Board