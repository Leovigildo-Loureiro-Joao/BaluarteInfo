import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaUserCircle } from 'react-icons/fa';

const CommentInput = ({ currentUser, onSubmit, isLoading = false }) => {
  const [comment, setComment] = useState('');
  const textareaRef = useRef(null);

  // Auto-ajustar altura do textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [comment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() && !isLoading) {
      onSubmit(comment);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-input-container">
      <div className="flex items-start gap-3">
        {/* Avatar do usuário */}
        <div className="flex-shrink-0 pt-1">
          {currentUser?.avatar ? (
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="text-gray-400 text-2xl" />
          )}
        </div>

        {/* Campo de texto */}
        <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 focus-within:border-primary transition-all">
          <textarea
            ref={textareaRef}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escreva seu comentário..."
            rows="1"
            className="w-full bg-transparent p-3 resize-none outline-none text-gray-800 placeholder-gray-400"
            aria-label="Digite seu comentário"
            maxLength="500"
          />

          {/* Rodapé do input */}
          <div className="flex justify-between items-center px-3 py-2 border-t border-gray-100">
            <span className={`text-xs ${comment.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>
              {comment.length}/500
            </span>
            
            <button
              type="submit"
              disabled={!comment.trim() || isLoading}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                comment.trim()
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              } transition-colors`}
              aria-label="Enviar comentário"
            >
              {isLoading ? (
                <span className="animate-spin">↻</span>
              ) : (
                <>
                  <span>Enviar</span>
                  <FaPaperPlane size={12} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentInput;