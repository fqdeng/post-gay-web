import AceEditor from "react-ace";
import React, {forwardRef, useEffect, useImperativeHandle, useRef} from "react";
import "ace-builds/src-noconflict/mode-json5";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/keybinding-vim"


import './Editor.css'
import * as ace from "ace-builds";
import QMessageBoxEnum from "../../common/QMessageBoxEnum";


interface VimEditorProps {
    id: string;
    onChange?: (value: string, event?: any) => void;
}

export interface VimEditorRef {
    setValue(value: string): void;
}

const Editor = forwardRef<VimEditorRef | undefined, VimEditorProps>((props, ref) => {

    useImperativeHandle(ref, () => ({
        setValue: (value: string) => {
            aceRef.current.editor.setValue(value)
        }
    }));


    const aceRef: any = useRef(null);

    useEffect(() => {
        if (aceRef.current) {
            const editor = aceRef.current.editor;
            if (editor) {
                console.log("init editor")
                editor.setOptions({wrap: 80})

                ace.config.loadModule('ace/keyboard/vim', function (module) {

                    // Hook vim editor error message
                    module.CodeMirror.defineExtension("openNotification", function (arg0: HTMLElement, arg1: object) {
                        console.log(arg0, arg1)
                        window.python.showMessageBox(QMessageBoxEnum.Warning, "error", `${arg0.innerText}`, QMessageBoxEnum.Ok)
                    })

                    // Vim command definition
                    const VimApi = module.CodeMirror.Vim;
                    const commands = [
                        {command: "write", simpleCommand: "w"},
                        {command: "edit", simpleCommand: "e"},
                        {command: "ls", simpleCommand: "l"},
                        {command: "execute", simpleCommand: "exec"},
                        {command: "quit", simpleCommand: "q"}
                    ];

                    commands.forEach(function (item) {
                        VimApi.defineEx(item.command, item.simpleCommand, function (cm: any, input: any) {
                            console.log(`${cm}, ${input}`)
                            // Handle the command
                            // Replace page.editorHandler.onCommand with your command handling logic
                        });
                    });
                });

                // Adjust mouse position clipping
                editor.renderer.screenToTextCoordinates = function (x: number, y: number) {
                    var pos = this.pixelToScreenCoordinates(x, y);
                    return this.session.screenToDocumentPosition(
                        Math.min(this.session.getScreenLength() - 1, Math.max(pos.row, 0)),
                        Math.max(pos.column, 0)
                    );
                };
            }
        }
    }, []);
    return (
        <AceEditor
            style={{width: 0, height: 0, minWidth: '800px', minHeight: '500px'}}
            setOptions={{useWorker: false}}
            fontSize={14}
            mode="json5"
            theme="github"
            onChange={props.onChange}
            name={props.id}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={false}
            editorProps={{$blockScrolling: true}}
            ref={aceRef}
            keyboardHandler={'vim'}
        />
    )

})

export default Editor;