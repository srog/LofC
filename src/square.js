import React from 'react';


function Square(props) {
  var imageSource = props.content == null ? null : './images/' + props.content;

  if (imageSource == null) {
    return (
      <button className="square" onClick={props.onClick} />
    );
  }

  return (
    <button className="square" > 
      <img onClick={props.onClick} src={imageSource} alt="" />      
    </button>
  );
}

export default Square 
