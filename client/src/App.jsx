import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, TextField, Typography } from "@mui/material";


const App = () => {
  // connection
  const socket = useMemo(() => {
    return io("http://localhost:8000");
  }, []);

  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);
  const [sockedId, setSocketId] = useState("");
  const [room, setRoom] = useState();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
      setSocketId(socket.id);
    });

    socket.on("welcome", (msg) => {
      console.log(msg);
    });

    socket.on("message", (message) => {
      // const msg = JSON.parse(message)
      console.log("message>>",message)
      setData((prev) => {
        return [...prev,message]
      });
    });

    return () => {
      socket.disconnect()
    }
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("event:message", {room,message});
    setMessage("");
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "5rem" }}>
      <Typography variant="h6" component="div" gutterBottom>
        {sockedId}
      </Typography>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
      >
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room-id"
          variant="outlined"
        />
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Message"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>

      <div>
        <ul>
          {
            data.map((item,ind) => (
              <li key={ind}> {item} </li>
            ))
          }
        </ul>
      </div>
    </Container>
  );
};

export default App;
