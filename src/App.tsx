import React, {useEffect} from 'react';
import './App.css';
import Counter from "./counter/Counter";

import {QWebChannel} from "qwebchannel";
import MessageBoxResult from "./common/MessageBoxResult";


interface Python {
    openFile(): Promise<string>;

    showMessageBox: (title: string, message: string) => Promise<MessageBoxResult>;
    log: (message: string) => void;
}

declare global {
    interface Window {
        python: Python;
        qt: any;
        app: any;
    }
}

function App() {
    useEffect(() => {
        if (window.app) {
            new QWebChannel(window.qt.webChannelTransport, function (channel: any) {
                window.python = channel.objects.python;
            });
        }
        return () => {
            console.log("unmount app")
        }
    }, []);
    return (
        <div className="App">
            <Counter/>
        </div>
    );
}

export default App;
