import React, {useEffect} from 'react';
import './App.css';
import Counter from "./counter/Counter";

import {QWebChannel} from "qwebchannel";

declare global {
    interface Window {
        python: any;
        qt: any;
        setFilePath: any;
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
    }, []);
    return (
        <div className="App">
            <Counter/>
        </div>
    );
}

export default App;
