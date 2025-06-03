'use client';
import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useTranslation } from '@/utils/useTranslation';

const WhatsAppChat = () => {
    const {t} = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');

    const whatsappNumber = '918799720115'; 

    const quickMessages = [
        t("whatsappChat.quickMessages.helpWithOrder"),
        t("whatsappChat.quickMessages.productAvailability"),
        t("whatsappChat.quickMessages.shippingQuestion"),
        t("whatsappChat.quickMessages.returnsHelp"),
        t("whatsappChat.quickMessages.trackOrder")
    ];

    const sendToWhatsApp = (messageText = message) => {
        const encodedMessage = encodeURIComponent(messageText);
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
        setIsOpen(false);
        setMessage('');
    };

    const handleQuickMessage = (quickMsg) => {
        sendToWhatsApp(quickMsg);
    };

    return (
        <>
            {/* Floating Chat Button */}
            <div className="fixed bottom-6 right-6 z-50">
                {!isOpen ? (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
                        aria-label="Open WhatsApp Chat"
                    >
                        <MessageCircle size={24} />
                    </button>
                ) : (
                    <div className="bg-white rounded-lg shadow-2xl w-80 border border-gray-200 overflow-hidden">
                        {/* Header */}
                        <div className="bg-green-500 text-white p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                    <MessageCircle size={16} className="text-green-500" />
                                </div>
                                <div>
                                        <h3 className="font-semibold">{t("whatsappChat.customerSupport")}</h3>
                                        <p className="text-xs opacity-90">{t("whatsappChat.replyTime")}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:bg-green-600 rounded-full p-1"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div className="p-4 max-h-96 overflow-y-auto">
                            {/* Welcome Message */}
                            <div className="bg-gray-100 rounded-lg p-3 mb-4">
                                <p className="text-sm text-gray-700">
                                        👋 {t("whatsappChat.welcomeMessage")}
                                </p>
                            </div>

                            {/* Quick Message Buttons */}
                            <div className="space-y-2 mb-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                                        {t("whatsappChat.quickQuestions")}
                                </p>
                                {quickMessages.map((quickMsg, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleQuickMessage(quickMsg)}
                                        className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200"
                                    >
                                        {quickMsg}
                                    </button>
                                ))}
                            </div>

                            {/* Custom Message Input */}
                            <div className="border-t pt-4">
                                    <p className="text-xs text-gray-500 mb-2">{t("whatsappChat.customMessageLabel")}</p>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                            placeholder={t("whatsappChat.inputPlaceholder")}
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        onKeyPress={(e) => e.key === 'Enter' && message.trim() && sendToWhatsApp()}
                                    />
                                    <button
                                        onClick={() => sendToWhatsApp()}
                                        disabled={!message.trim()}
                                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg px-3 py-2 transition-colors duration-200"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-4 py-2 text-center">
                            <p className="text-xs text-gray-500">
                                    {t("whatsappChat.redirectNote")}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-20 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default WhatsAppChat;