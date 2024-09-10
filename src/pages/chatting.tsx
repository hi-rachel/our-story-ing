import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import Image from "next/image";

const Chatting = () => {
  const [chatting, setChatting] = useState<
    {
      id: string;
      text: string;
      userId: string;
      displayName: string;
      photoURL: string;
      createdAt: Date;
    }[]
  >([]);
  const [newChat, setNewChat] = useState("");

  useEffect(() => {
    const q = query(collection(db, "chatting"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text || "",
          userId: data.userId || "",
          displayName: data.displayName || "Unknown",
          photoURL: data.photoURL || "",
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      });
      setChatting(msgs);
    });
    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    if (newChat.trim() === "") return;
    const user = auth.currentUser;
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    await addDoc(collection(db, "chatting"), {
      text: newChat,
      createdAt: new Date(),
      userId: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
    setNewChat("");
  };

  // 날짜/시간 포맷 함수 (24/09/10 오후 10:11 형식으로 변환)
  const formatDate = (date: Date) => {
    const dateString = date.toLocaleDateString("ko-KR", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    });
    const timeString = date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${dateString} ${timeString}`;
  };

  return (
    <div className="flex flex-col h-screen bg-background p-4">
      {/* 채팅 메시지 리스트 */}
      <div className="flex-1 overflow-y-auto p-4 bg-white rounded-lg shadow-card">
        {chatting.map((msg) => (
          <div
            key={msg.id}
            className={`mb-3 flex items-start ${
              msg.userId === auth.currentUser?.uid
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {/* 상대방 메시지일 때만 유저 정보 표시 */}
            {msg.userId !== auth.currentUser?.uid ? (
              <div className="flex items-start mr-3">
                <Image
                  src={msg.photoURL || "icons/heart.svg"}
                  alt="User Image"
                  className="w-8 h-8 rounded-full"
                  width={600}
                  height={600}
                />
                <div className="ml-2">
                  <div className="text-sm text-gray-600">{msg.displayName}</div>
                  <div className="flex items-end gap-2 mt-2">
                    <p
                      className={`p-3 rounded-lg inline-block ${
                        msg.userId === auth.currentUser?.uid
                          ? "bg-primary text-white"
                          : "bg-secondary text-text"
                      }`}
                    >
                      {msg.text}
                    </p>
                    <span className="text-xs text-gray-500 block">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* 내가 보낸 메시지일 때 */
              <div className="flex flex-col items-end">
                <div className="flex items-end gap-2">
                  <span className="text-xs text-gray-500 block">
                    {formatDate(msg.createdAt)}
                  </span>
                  <p className="bg-primary text-white p-3 rounded-lg inline-block">
                    {msg.text}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 입력 필드 */}
      <div className="flex mt-4">
        <input
          type="text"
          value={newChat}
          onChange={(e) => setNewChat(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 rounded-l-lg border border-gray-300 shadow-button focus:outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="bg-primary text-white p-3 rounded-r-lg shadow-button hover:bg-accent"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatting;
