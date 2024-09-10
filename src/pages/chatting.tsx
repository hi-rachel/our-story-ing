import { useEffect, useState, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import Image from "next/image";
import { IoArrowBackOutline, IoArrowDown } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/router";

// TODO
// [] 커플 연결 구현 완료 후, 커플 연결된 두 명끼리만 채팅 가능하게 하기
// -> 다른 사용자 접근 불가, 2명만 입장 가능, 커플이 아니면 접근 불가
// [] 다국화 적용 -> 영어 시간 포맷 표시
// [] 채팅방 나가기
// [] 채팅방 삭제
// [] 새 메시지 알림
// [] 알림 모달 넣기

const Chatting = () => {
  const router = useRouter();
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
  const [isComposing, setIsComposing] = useState(false); // IME 입력 상태 관리(한글)
  const [isSending, setIsSending] = useState(false); // 메시지 전송 중인지 확인하는 상태
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

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
      scrollToBottom(); // 새로운 메시지 수신 시 스크롤 아래로 이동
    });
    return () => unsubscribe();
  }, []);

  // 처음 화면 접속시 가장 아래 메시지 보여주기
  useEffect(() => {
    if (chatting.length > 0) {
      scrollToBottom();
    }
  }, [chatting]);

  // 스크롤 맨 아래로 이동 함수
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 새 메시지 추가 함수
  const handleSendMessage = async () => {
    if (newChat.trim() === "" || isSending) {
      alert("메시지를 입력해주세요.");
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    setIsSending(true);
    try {
      await addDoc(collection(db, "chatting"), {
        text: newChat,
        createdAt: new Date(),
        userId: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
      setNewChat("");
      scrollToBottom(); // 메시지 전송 후 스크롤 아래로 이동
    } catch (error) {
      console.error("메시지 전송 오류:", error);
    } finally {
      setIsSending(false); // 전송 완료 후 상태 초기화
    }
  };

  // 엔터키로 메시지 전송
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // IME 입력 상태 처리
  const handleCompositionStart = () => {
    setIsComposing(true); // IME 입력 시작
  };

  const handleCompositionEnd = () => {
    setIsComposing(false); // IME 입력 완료
  };

  // 스크롤 이벤트 감지 (위로 스크롤 시 화살표 버튼 보이기)
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollTop + clientHeight < scrollHeight) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  // 날짜/시간 포맷 함수 (24.09.10 오후 10:11 형식으로 변환)
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

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col h-screen bg-background p-4">
      {/* 채팅방 헤더 */}
      <div className="flex items-center bg-white p-4 shadow-lg rounded-lg mb-4">
        <IoArrowBackOutline
          className="text-2xl cursor-pointer mr-2"
          onClick={handleGoBack}
        />
        {/* 📍 상대방 이름으로 바꾸기 */}
        <div className="flex-grow text-center font-semibold">Couple Chat</div>
      </div>

      {/* 채팅 메시지 리스트 */}
      <div
        className="flex-1 overflow-y-auto p-4 bg-white rounded-lg shadow-card"
        onScroll={handleScroll}
      >
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
        {/* 스크롤 하단 기준점 */}
        <div ref={chatEndRef} />
      </div>

      {/* 스크롤 맨 아래로 이동하는 버튼 */}
      {showScrollButton && (
        <button
          className="fixed bottom-20 right-5 p-2 bg-primary text-white rounded-full shadow-lg"
          onClick={scrollToBottom}
        >
          <IoArrowDown className="text-2xl" />
        </button>
      )}

      {/* 입력 필드 */}
      <div className="flex mt-4">
        <input
          type="text"
          value={newChat}
          onChange={(e) => setNewChat(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart} // IME 입력 시작
          onCompositionEnd={handleCompositionEnd} // IME 입력 완료
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
