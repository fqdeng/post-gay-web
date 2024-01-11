import React, {useState} from 'react';
import MessageBoxResult from "../common/MessageBoxResult";


function Counter() {
    const [count, setCount] = useState(0);
    const [filePath, setFilePath] = useState("");
    const [message, setMessage] = useState("");

    const handleIncrement = () => {
        if (window.app) {
            window.python.log(`${count}`)
        }
        setCount(count + 1);
    };


    const openFile = () => {
        if (window.app) {
            const filePath = window.python.openFile()
            filePath.then((result: string) => {
                setFilePath(result);
                console.log(result);
            })
        } else {
            alert("It's in browser environment!")
        }
    }


    const showMessageBox = () => {
        if (window.app) {
            const message = window.python.showMessageBox("Tite", "Message")
            message.then((result: MessageBoxResult) => {
                if (result == MessageBoxResult.Cancel) {
                    console.log("Cancel")
                }
                if (result == MessageBoxResult.Ok) {
                    console.log("Ok")
                }
            })
        } else {
            alert("It's in browser environment!")
        }
    }

    return (
        <div>
            <p>You clicked {count} times</p>
            <p>You opened {filePath} !</p>
            <button onClick={handleIncrement}>
                Click me
            </button>
            <button onClick={openFile}>
                OpenFile
            </button>
            <button onClick={showMessageBox}>shoMessage</button>
        </div>
    );
}

export default Counter;