import { useEffect } from "react";
import { useSelector } from "react-redux";
import socket from "../utils/socket";

const NotificationManager = () => {
    const { loggedUser, selectedUser } = useSelector((state) => state.conversation);

    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        const handleReceiveMessage = (message) => {
            const isMessageFromLoggedUser = message.senderName === loggedUser;
            const isUserAlreadyChatting = selectedUser === message.senderName;

            if (Notification.permission === "granted" && !isMessageFromLoggedUser && !isUserAlreadyChatting) {
                new Notification(`New message from ${message.senderName}`, {
                    body: message.content,
                });
            }
        };

        socket.on("receiveMessage", handleReceiveMessage);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
        };
    }, [loggedUser, selectedUser]);

    return null;
};

export default NotificationManager;
