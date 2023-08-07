import { io, Socket } from "socket.io-client";
import React, { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app/chatbot.css';

interface ServerResponse {
  data: string
}
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://127.0.0.1:8000';
// const socket = io(URL, {transports: ['websocket', 'polling', 'flashsocket']});
const socket = io(URL);

export default function ChatBot() {
  const [chatHistory, setChatHistory] = useState<string>("");
  const [clientMessage, setClientMessage] = useState<string>("Enter your question here");
  const ref = useRef(null);

  socket.on("server response", (arg: ServerResponse) => {
    console.log("received message:" + arg['data']); // world
    setChatHistory(chatHistory + '\nFoodTBD:\n'+ arg['data'] + '\n');
  });

  useEffect(() => {
    socket.on("connect", () => {
      console.log("socket.id: " + socket.id); // x8WIv7-mJelg7on_ALbx
    });
  }, []);

  const onSubmit = (event: { preventDefault: () => void; target: any; }) => {
    event.preventDefault();
    const form = event.target;
    let cmsg: string = form.client_message.value;
    let updated_history_str = chatHistory + '\nFoodie:\n' + cmsg + '\n';
    setChatHistory(updated_history_str);
    ref.current.value = "";
    console.log(cmsg);
    socket.emit('client message event', { data: cmsg });
  }
  return (
    <Container className="p-3">
      <div className="col-xs-12 col-sm-6 col-md-8">
        <textarea className='messages' defaultValue={chatHistory}></textarea>
        <Form onSubmit={onSubmit} className="chat">
          <Form.Group className="client_message" controlId="client_message">
            <b>></b><Form.Control ref={ref} placeholder={clientMessage} type="text"/>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </Container>
  )
}
