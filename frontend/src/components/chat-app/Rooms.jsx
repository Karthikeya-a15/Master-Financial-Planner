import React, { useEffect, useState } from "react";
import axios from "axios";
import Chat from "./Chat";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    axios.get("/api/v1/user/rooms").then((res) => {
      setRooms(res.data);
    });
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Chat Rooms</h1>
        </div>
        
        <div className="overflow-y-auto">
          {rooms.map((room) => (
            <button
              key={room._id}
              onClick={() => setSelectedRoom(room)}
              className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                selectedRoom?._id === room._id ? 'bg-blue-100 border-black border-2' : ''
              }`}
            >
              <div className="font-medium">{room.name}</div>
              {room.lastMessage && (
                <div className="text-sm text-gray-500 truncate">
                  {room.lastMessage}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1">
        {selectedRoom ? (
          <Chat roomId={selectedRoom._id} roomName={selectedRoom.name} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a chat room to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;