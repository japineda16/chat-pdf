import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const Chat: React.FC = () => {
  const asd = [1, 2, 3, 4, 5, 6, 7, 8, 9, 13, 2, 34, 21];
  return (
    <div className="bg-gray-50">
      <div className="container">
        <div className="flex flex-col h-screen">
          <div className="flex-1 overflow-y-auto my-5">
            <Card className="my-3 w-[90%] ml-auto">
              <CardContent>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam auctor, nunc id aliquam tincidunt, nisl nulla tincidunt
                  nunc, id aliquet risus nunc id nunc. Sed auctor, mauris id
                  aliquam tincidunt, nisl nulla tincidunt nunc, id aliquet risus
                  nunc id nunc.
                </p>
              </CardContent>
            </Card>
            <Card className="my-3 w-[90%] mr-auto">
              <CardContent>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam auctor, nunc id aliquam tincidunt, nisl nulla tincidunt
                  nunc, id aliquet risus nunc id nunc. Sed auctor, mauris id
                  aliquam tincidunt, nisl nulla tincidunt nunc, id aliquet risus
                  nunc id nunc.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="flex items-center justify-center h-28 bg-gray-50 border-t-2">
            <input
              type="text"
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Escribe un mensaje..."
            />
            <button className="ml-2 px-4 py-2 text-white bg-indigo-500 rounded-md shadow-md">
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
