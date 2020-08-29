import React, {Component, useRef, useState} from 'react';
import './App.css';
import Message from "./Message";

// const url = 'ws://localhost:8000/ws/chat'
const url = 'wss://super-nice-chat-app-backend.herokuapp.com/ws/chat'


class App extends Component {

    constructor(props) {
        super(props);
        this.ws = new WebSocket(url)
        this.state = {
            message: '',
            messages: ['Hi', 'Hello']
        }
    }


    componentDidMount() {
        this.ws.onopen = () => {
            // on connecting, do nothing but log it to the console
            console.log('connected')
        }

        this.ws.onmessage = (e) => {
            const data = JSON.parse(e.data)
            console.log(data)
            let new_messages = this.state.messages
            new_messages.push(data['message'])
            this.setState(new_messages)
        }

        this.ws.onclose = () => {
            console.log('disconnected')
            // automatically try to reconnect on connection loss

        }
    }

    send = () => {
        this.ws.send(JSON.stringify({'message': this.state.message}))
    }

    render() {
        return (

            <div className="App">
                {this.state.messages.map((message) => (
                    <Message
                        body={message}
                    />
                ))}

                <input
                    onChange={(e) => {
                        this.setState({message:e.target.value})
                    }}
                />
                <button onClick={this.send}>Send</button>

            </div>
        );
    }
}

export default App;
