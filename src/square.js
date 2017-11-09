import React from 'react';


function Square(props) {
  var imageSource = props.content == null ? null : './images/' + props.content;
  var SHOWIMAGES = true;

  if (imageSource === null) {
    return (
      <button className="square" onClick={props.onClick} />
    );
  }

  if (SHOWIMAGES === true)
  {
    return (
      <button className="square" > 
        <img onClick={props.onClick} src={imageSource} alt="" />      
      </button>
    );
  }

  return (
    <button className="square" > 
      <li onClick={props.onClick} text={props.textDetail} />      
    </button>
  );

}

export default Square; 
