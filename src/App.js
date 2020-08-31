import React, {Component, useRef, useState} from 'react';
import './App.css';

import ReconnectingWebSocket from 'reconnecting-websocket';

import Message from "./Message";

// const url = 'ws://localhost:8000/ws/chat'
const url = 'wss://super-nice-chat-app-backend.herokuapp.com/ws/chat'


class App extends Component {

    constructor(props) {
        super(props);
        this.ws = new ReconnectingWebSocket(url)
        this.state = {
            name: '',
            message: '',
            messages: [],
            status: 'Connecting...'
        }
    }

    connect = () => {
        this.ws = new ReconnectingWebSocket(url)
        this.ws.onopen = () => {
            // on connecting, do nothing but log it to the console
            clearInterval(this.retry)
            console.log('connected')
            this.setState({status: 'Connected :)'})
        }
        this.ws.onmessage = (e) => {
            const data = JSON.parse(e.data)
            console.log(data)
            if (data['type'] === 'old_messages') {
                let messages = data['messages']
                this.setState({messages: messages})
            } else if (data['type'] === 'new_message') {
                let new_messages = this.state.messages
                new_messages.push(data['message'])
                this.setState({messages: new_messages})
            }
        }

        this.ws.onclose = () => {
            console.log('disconnected')
            this.setState({status: 'connecting...'})

        }
    }

    componentDidMount() {
        this.connect()
    }

    send = (e) => {
        if (this.state.name !== '' && this.state.message !== '') {

            try {
                e.preventDefault()
            } catch (e) {
            }
            this.setState({message: ''})
            this.ws.send(JSON.stringify({
                'message': {
                    body: this.state.message,
                    name: this.state.name
                }
            }))
        }else{
            if (this.state.name === ''){
                alert('Please pick a name')
            }else{
                alert("Message can't be empty can it? :)")
            }

        }
    }

    render() {
        return (
            <div className="App">
                    <p className='status'>{this.state.status}</p>

                <div className='message_container'>
                    {this.state.messages.map((message) => (
                        <Message
                            username={this.state.name}
                            message={message}
                        />
                    ))}
                </div>
                <form onSubmit={this.send} className='input_row'>

                    <input
                        className='name_input'

                        value={this.state.name}
                        onChange={(e) => {
                            this.setState({name: e.target.value})
                        }}
                        placeholder={'Name'}
                    />


                    <input
                        className='message_input'
                        value={this.state.message}
                        onChange={(e) => {
                            this.setState({message: e.target.value})
                        }}
                        placeholder={'Hit Enter to send'}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                this.send()
                            }
                        }}
                    />


                    {/*<div*/}
                    {/*    className='send_btn'*/}
                    {/*    onClick={this.send}>Send*/}
                    {/*</div>*/}

                </form>

            </div>
        );
    }
}

export default App;
