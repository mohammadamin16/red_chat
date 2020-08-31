import React from 'react';


export default function Message(props) {
    if (props.username === props.message.name){
        return (
            <div className='message own_message' style={{alignSelf:'flex-end'}}>

            <p className='message_body own_message_body'>{props.message.body}</p>
        </div>
    )}else {
        return (
            <div className='message' style={{alignSelf:'flex-start'}}>

                <p className='message_name'>
                    <span>{props.message.name.substring(0,2).toUpperCase()}</span></p>
                <p className='full_name'>{props.message.name}</p>
                <p className='message_body'>{props.message.body}</p>
            </div>
        );
    }
}





