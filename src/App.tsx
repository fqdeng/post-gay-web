import React, {useEffect, useRef} from 'react';
import './App.css';
import Window, {WindowRef} from "./app/Window";

import {QWebChannel} from "./qt/qwebchannel";
import QMessageBoxEnum from "./common/QMessageBoxEnum";


interface Python {

    openFile: (fileTypes: string) => Promise<string>;
    showMessageBox: (icon: number, title: string, message: string, buttons: number) => Promise<QMessageBoxEnum>;
    log: (message: string) => void;
    saveFile: (file_path: string, file_content: string) => void;
    readFile: (file_path: string) => Promise<string>;
}

declare global {
    interface Window {
        python: Python;
        qt: any;
        app: any;
    }
}

function App() {

    const windowRef = useRef<WindowRef>();

    useEffect(() => {
        if (window.app) {
            new QWebChannel(window.qt.webChannelTransport, function (channel: any) {
                window.python = channel.objects.python;
                windowRef.current?.pythonWorldInit()
            });
        } else {
            const handler: ProxyHandler<any> = {
                get(target, prop, receiver) {
                    if (typeof prop === 'string') {
                        return (...args: any[]) => {
                            console.log(`method ${prop} has been called with arguments: ${args}`);
                            alert("it's in browser environment!");
                            return new Promise((resolve, reject) => {
                            });
                        };
                    }
                },
            };
            window.python = new Proxy({} as Python, handler);
        }
        return () => {
            console.log("unmount app")
        }
    }, []);
    return (
        <div className="App">
            <Window ref={windowRef}/>
        </div>
    );
}

export default App;