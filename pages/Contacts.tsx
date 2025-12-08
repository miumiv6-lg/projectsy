import React from 'react';
import { Gamepad2, Mail } from 'lucide-react';

const Contacts: React.FC = () => {
  return (
    <div className="w-full px-4 max-w-xl mx-auto py-10">
      
      <div className="text-center mb-10 animate-ios-slide-up">
        <h1 className="text-4xl font-bold text-white mb-2">Контакты</h1>
        <p className="text-gray-400">Связь с администрацией</p>
      </div>

      <div className="space-y-4">
         {/* Telegram */}
         <a href="#" className="flex items-center p-5 bg-[#1C1C1E] rounded-[24px] hover:bg-[#2C2C2E] transition-colors active-scale animate-ios-slide-up delay-100 opacity-0 fill-mode-forwards">
            <div className="w-12 h-12 rounded-full bg-[#229ED9] flex items-center justify-center text-white mr-5 shadow-lg shadow-blue-400/20">
              <img 
                src="https://img.icons8.com/?size=100&id=lUktdBVdL4Kb&format=png&color=FFFFFF" 
                alt="Telegram" 
                className="w-6 h-6" 
              />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">Telegram</h3>
              <p className="text-gray-400 font-medium">Канал новостей</p>
            </div>
         </a>
        
         {/* Steam */}
         <a href="#" className="flex items-center p-5 bg-[#1C1C1E] rounded-[24px] hover:bg-[#2C2C2E] transition-colors active-scale animate-ios-slide-up delay-200 opacity-0 fill-mode-forwards">
            <div className="w-12 h-12 rounded-full bg-[#171a21] flex items-center justify-center text-white mr-5 shadow-lg shadow-black/30">
              <img 
                src="https://img.icons8.com/?size=100&id=pOa8st0SGd5C&format=png&color=FFFFFF" 
                alt="Steam" 
                className="w-6 h-6" 
              />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">Steam Workshop</h3>
              <p className="text-gray-400 font-medium">Коллекция аддонов</p>
            </div>
         </a>

         {/* Roblox */}
         <a href="#" className="flex items-center p-5 bg-[#1C1C1E] rounded-[24px] hover:bg-[#2C2C2E] transition-colors active-scale animate-ios-slide-up delay-300 opacity-0 fill-mode-forwards">
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white mr-5 shadow-lg shadow-red-500/20">
              <Gamepad2 size={24} />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">Roblox</h3>
              <p className="text-gray-400 font-medium">Архив группы</p>
            </div>
         </a>

         {/* Email */}
         <div className="flex items-center p-5 bg-[#1C1C1E] rounded-[24px] animate-ios-slide-up delay-400 opacity-0 fill-mode-forwards">
            <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center text-white mr-5">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">Email</h3>
              <p className="text-gray-500 font-medium select-all">support@projectsy.com</p>
            </div>
         </div>
      </div>

      <div className="mt-12 text-center animate-ios-slide-up delay-500 opacity-0 fill-mode-forwards">
        <p className="text-gray-500 mb-6 font-medium">Есть вопрос по серверу?</p>
        <button className="bg-brand-blue hover:bg-blue-600 text-white font-bold py-4 px-12 rounded-full text-lg shadow-lg shadow-blue-900/50 active-scale transition-all">
           Написать Админу
        </button>
      </div>

    </div>
  );
};

export default Contacts;