import React from 'react';


function Square(props) {
  var imageSource = props.content == null ? null : './images/' + props.content;
  var SHOWIMAGES = false;

  if (imageSource == null) {
    return (
      <button className="square" onClick={props.onClick} />
    );
  }

  if (SHOWIMAGES == true)
  {
    return (
      <button className="square" > 
        <img onClick={props.onClick} src={imageSource} alt="" />      
      </button>
    );
  }

  return (
    <button className="square" > 
      <textarea onClick={props.onClick} text={props.textDetail} alt="" />      
    </button>
  );

}

export default Square; 
