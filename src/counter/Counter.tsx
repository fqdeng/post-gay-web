import React, {useState} from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    const [filePath, setFilePath] = useState("");

    const handleIncrement = () => {
        if (window.app) {
            window.python.log(`${count}`)
        }
        setCount(count + 1);
    };

    const handleOpenFile = (json: JSON) => {
        setFilePath(JSON.stringify(json))
    }


    const openFile = () => {
        if (window.app) {
            const filePath = window.python.openFile()
        }else{
            alert("It's in browser environment!")
        }
        window.setFilePath = handleOpenFile;
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
        </div>
    );
}

export default Counter;