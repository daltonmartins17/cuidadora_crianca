import React, { useState, useEffect } from "react";
import { Mail, Check, Send } from "lucide-react";
import { messageService } from "../api/services";
import Loading from "../components/Loading";

const Messages = ({ onUnreadUpdate }) => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [composeData, setComposeData] = useState({
    receiverId: "",
    subject: "",
    content: "",
  });

  useEffect(() => {
    loadMessages();
  }, [activeTab]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const response =
        activeTab === "inbox"
          ? await messageService.getInbox()
          : await messageService.getSentMessages();
      setMessages(response.data);
      if (onUnreadUpdate && activeTab === "inbox") {
        const unreadCount = response.data.filter((m) => !m.isRead).length;
        onUnreadUpdate();
      }
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await messageService.markAsRead(id);
      loadMessages();
      if (onUnreadUpdate) {
        onUnreadUpdate();
      }
    } catch (error) {
      console.error("Erro ao marcar como lido:", error);
    }
  };

  const handleReply = (message) => {
    setReplyTo(message);
    setComposeData({
      receiverId: message.senderId,
      subject: `Re: ${message.subject}`,
      content: "",
    });
    setShowCompose(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await messageService.sendMessage({
        receiverId: parseInt(composeData.receiverId, 10),
        subject: composeData.subject,
        content: composeData.content,
      });
      setShowCompose(false);
      setReplyTo(null);
      setComposeData({ receiverId: "", subject: "", content: "" });
      loadMessages();
      if (onUnreadUpdate) {
        onUnreadUpdate();
      }
      alert("Mensagem enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      alert(
        error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Erro ao enviar mensagem",
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl card-shadow overflow-hidden">
        {/* Header */}
        <div className="gradient-primary text-white p-6">
          <div className="flex items-center gap-3">
            <Mail size={32} />
            <div>
              <h1 className="text-3xl font-bold">Mensagens</h1>
              <p className="text-purple-100">Comunique com pais e babás</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("inbox")}
            className={`flex-1 py-4 text-center font-semibold transition ${
              activeTab === "inbox"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Caixa de Entrada
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`flex-1 py-4 text-center font-semibold transition ${
              activeTab === "sent"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Enviadas
          </button>
        </div>

        {/* Compose Button */}
        {!showCompose && (
          <div className="p-4 border-b">
            <button
              onClick={() => setShowCompose(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Send size={18} />
              Nova Mensagem
            </button>
          </div>
        )}

        {/* Compose Form */}
        {showCompose && (
          <div className="p-6 border-b bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">
              {replyTo ? `Responder a ${replyTo.senderName}` : "Nova Mensagem"}
            </h3>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Para (ID do Utilizador)
                </label>
                <input
                  type="number"
                  value={composeData.receiverId}
                  onChange={(e) =>
                    setComposeData({
                      ...composeData,
                      receiverId: parseInt(e.target.value),
                    })
                  }
                  placeholder="ID"
                  required
                  disabled={!!replyTo}
                  className="input-field disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assunto
                </label>
                <input
                  type="text"
                  value={composeData.subject}
                  onChange={(e) =>
                    setComposeData({ ...composeData, subject: e.target.value })
                  }
                  placeholder="Assunto"
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mensagem
                </label>
                <textarea
                  value={composeData.content}
                  onChange={(e) =>
                    setComposeData({ ...composeData, content: e.target.value })
                  }
                  placeholder="Sua mensagem..."
                  rows="4"
                  required
                  className="input-field"
                ></textarea>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn-primary">
                  Enviar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCompose(false);
                    setReplyTo(null);
                    setComposeData({
                      receiverId: "",
                      subject: "",
                      content: "",
                    });
                  }}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Messages List */}
        <div>
          {loading ? (
            <Loading />
          ) : messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.id}
                onClick={() =>
                  activeTab === "inbox" &&
                  !message.isRead &&
                  handleMarkAsRead(message.id)
                }
                className={`p-6 border-b hover:bg-gray-50 cursor-pointer transition ${
                  activeTab === "inbox" && !message.isRead ? "bg-purple-50" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">
                        {activeTab === "inbox"
                          ? message.senderName
                          : message.receiverName}
                      </h3>
                      {activeTab === "inbox" && message.isRead && (
                        <Check size={16} className="text-green-600" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {message.subject}
                    </p>
                    <p className="text-gray-700 line-clamp-2">
                      {message.content}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <p className="text-gray-500 text-sm whitespace-nowrap">
                      {new Date(message.sentAt).toLocaleDateString("pt-PT")}
                    </p>
                    {activeTab === "inbox" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReply(message);
                        }}
                        className="btn-secondary text-xs px-3 py-1"
                      >
                        Responder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Mail size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">Nenhuma mensagem</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
