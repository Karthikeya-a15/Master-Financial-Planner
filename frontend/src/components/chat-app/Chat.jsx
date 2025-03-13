import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useDropzone } from 'react-dropzone';
import { PaperAirplaneIcon, PaperClipIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';

const socket = io("http://localhost:3000", {
  auth: { token: localStorage.getItem("token") },
});

const Chat = ({ roomId, roomName }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [socketId, setSocketId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const isInitialLoad = useRef(true);
  const loadMoreTimeoutRef = useRef(null);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      setUploading(true);
      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('roomId', roomId);
        
        try {
          const response = await axios.post('/api/v1/user/chat-upload', formData);
          socket.emit("sendMessage", { 
            roomId, 
            message: "", 
            attachment: {
              url: response.data.fileUrl,
              filename: file.name,
              type: file.type
            }
          });
        } catch (error) {
          console.error('Upload failed:', error);
        }
      }
      setUploading(false);
    }
  });

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Immediate scroll to bottom on initial load
  useEffect(() => {
    if (messages.length > 0 && isInitialLoad.current) {
      scrollToBottom("auto"); // Use "auto" for immediate scroll without animation
      isInitialLoad.current = false;
    }
  }, [messages]);

  useEffect(() => {
    if (!roomId) return;

    setMessages([]);
    setPage(1);
    setHasMore(true);
    isInitialLoad.current = true;

    setSocketId(JSON.parse(localStorage.getItem("currentUser")).id)

    socket.emit("joinRoom", { roomId, page: 1, limit: 20 });

    socket.on("previousMessages", (msgs) => {
      if (msgs.length < 20) {
        setHasMore(false);
      }
      setMessages((prev) => [...msgs, ...prev]);
    });
    
    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });
    
    return () => {
      socket.off("previousMessages");
      socket.off("newMessage");
      // Clear any pending timeouts when component unmounts
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current);
      }
    };
  }, [roomId]);

  const handleScroll = () => {
    if (chatContainerRef.current.scrollTop === 0 && !loading && hasMore) {
      // Clear any existing timeout
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current);
      }
      
      setLoading(true);
      
      loadMoreTimeoutRef.current = setTimeout(() => {
        loadMoreMessages();
      }, 1000);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    socket.emit("sendMessage", { roomId, message : message.trim() });
    setMessage("");
  };

  const loadMoreMessages = async () => {
    if (!hasMore) return;
    
    const nextPage = page + 1;
    socket.emit("joinRoom", { roomId, page: nextPage, limit: 20 });
    setPage(nextPage);
    setLoading(false);
  };

  const renderMessage = (msg) => {
    const isCurrentUser = msg.senderId === socketId;
    
    return (
      <div
        key={msg._id}
        className={`flex w-full mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`relative max-w-[70%] rounded-lg p-3 ${
            isCurrentUser
              ? 'bg-blue-500 text-white ml-auto'
              : 'bg-gray-200 text-gray-800 mr-auto'
          }`}
        >
          {!isCurrentUser && (
            <p className="text-sm font-semibold mb-1 text-left">{msg.senderName}</p>
          )}
          
          {!isCurrentUser && msg.message ? <div className="flex justify-start mb-3"> <p className="break-words">{msg.message}</p> </div> : <div className="flex justify-end mb-3"> <p className="break-words">{msg.message}</p> </div>}
          
          {msg.attachment && (
            <div className="mt-2">
              {msg.attachment.type.startsWith('image/') ? (
                <img
                  src={msg.attachment.url}
                  alt={msg.attachment.filename}
                  className="rounded"
                  style= {{width: '25rem'}}
                />
              ) : (
                <a
                  href={msg.attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline"
                >
                  📎 {msg.attachment.filename}
                </a>
              )}
            </div>
          )}
          
          <div className={`text-xs mt-1 ${isCurrentUser ? 'opacity-75' : 'text-gray-500'}`}>
            {format(new Date(msg.createdAt), 'dd/MM/yy hh:mm')}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b p-4">
        <h2 className="text-xl font-semibold">{roomName}</h2>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4"
        onScroll={handleScroll}
      >
        {loading && hasMore && (
          <div className="text-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Loading previous messages...</p>
          </div>
        )}
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="border-t p-4 bg-white">
        <div className="flex items-center gap-2">
          <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />
            <button type="button" className="p-2 hover:bg-gray-100 rounded-full" disabled={uploading}>
              <PaperClipIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50" disabled={!message.trim() || uploading}>
            <PaperAirplaneIcon className="h-6 w-6" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;