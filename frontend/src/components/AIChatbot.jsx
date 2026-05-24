import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm your CraveBite AI Assistant. Hungry? Tell me what you're craving or ask for a recommendation!", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const newMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Mock AI response
    setTimeout(() => {
      let aiText = "I can definitely help with that! Why don't you check out our 'Menu' page and try the Voice Search feature?";
      
      const lowerInput = newMsg.text.toLowerCase();
      if (lowerInput.includes('pizza') || lowerInput.includes('italian')) {
        aiText = "Craving Pizza? 🍕 I highly recommend 'Luigi's Oven' or 'Pizza Hut'. You can use the 'Find Near Me' feature to see what's closest!";
      } else if (lowerInput.includes('healthy') || lowerInput.includes('salad')) {
        aiText = "Looking for something healthy? 🥗 Check out 'Green Bowl' in our restaurants. Don't forget to look at the calorie tags on the food items!";
      } else if (lowerInput.includes('coupon') || lowerInput.includes('discount')) {
        aiText = "Use code 'CRAVE20' at checkout to get 20% off your first order! 🎉";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiText, sender: 'ai' }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-6 z-50 p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-2xl hover:scale-110 transition-transform ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6" />
                <span className="font-bold">CraveBite AI Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--background)]">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.sender === 'user' 
                        ? 'bg-orange-500 text-white rounded-tr-sm shadow-md' 
                        : 'bg-[var(--muted)] text-[var(--foreground)] rounded-tl-sm border border-[var(--border)] shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-[var(--card)] border-t border-[var(--border)]">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-[var(--muted)] border border-[var(--border)] rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-[var(--foreground)]"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
