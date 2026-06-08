import { useEffect, useRef, useState } from "react";

import { MessageCircle } from "lucide-react";

const CommentButton = ({ comments }) => {
  const [showComments, setShowComments] = useState(false);

  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowComments(false);
      }
    };

    if (showComments) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showComments]);

  return (
    <>
      <button
        className={`flex flex-col items-center gap-1 rounded-full p-3 backdrop-blur-md transition-colors ${
          showComments
            ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
        onClick={() => setShowComments(true)}
      >
        <MessageCircle size={24} />
        <div className="mt-1 text-sm text-white">{comments}</div>
      </button>

      {showComments && (
        <div
          className="fixed inset-0 flex items-end justify-center bg-black/50"
          onClick={() => setShowComments(false)} // Click vào nền để đóng
        >
          {/* Ngăn sự kiện onClick lan ra ngoài */}
          <div
            ref={modalRef}
            className="w-full max-w-md rounded-t-lg bg-white p-5 text-black"
            onClick={(e) => e.stopPropagation()} // Chặn sự kiện từ modal
          >
            <div className="comments">
              <p>
                <strong>User1:</strong> Video hay quá!
              </p>
              <p>
                <strong>User2:</strong> Cười xỉu 🤣
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommentButton;
