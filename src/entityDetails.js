import React from 'react';

function renderResourceList(resources) {
    return resources.map((elem) => <tr><td>{elem.name}</td><td>{elem.quantity}</td></tr> )
}

function EntityDetails(props) {
  if (props.entity.type === 'resource') {
          return (
            <table>
                <tr>
                    <td>
                        Selected Entity:
                    </td>
                    <td>
                    </td>
                </tr>
                <tr>
                    <td>
                        {props.entity.name + ' (' + props.entity.quantity + ')'}
                    </td>
                    <td>                        
                    </td>
                </tr>
            </table>
          ); 
    }
    
  return (
      
    <table>
        <tr>
            <td>
                Selected Entity:
            </td>
            <td>
            </td>
        </tr>
        <tr>
            <td>
                Name:
            </td>
            <td>
                {props.entity.name}
            </td>
        </tr>
        <tr>
            <td>
                AP:
            </td>
            <td>
                {props.entity.ap}
            </td>
        </tr>

        <tr>
            <td>
                Owner:
            </td>
            <td>
                {props.entityOwner == null ? '(Neutral)' : props.entityOwner.name}
            </td>
        </tr>
        <tr>
            <td>
                Attack:
            </td>
            <td>
                {props.entity.attack}
            </td>
        </tr>
        <tr>
            <td>
                Defense:
            </td>
            <td>
                {props.entity.defense}
            </td>
        </tr>
        <tr>
            <td>
                Resources:
            </td>
            <td>
                {props.entity.resources.length === 0 ? 'None' : null}
            </td>
        </tr>
        <tr></tr>

        {renderResourceList(props.entity.resources)}

    </table>

  );
}

export default EntityDetails 