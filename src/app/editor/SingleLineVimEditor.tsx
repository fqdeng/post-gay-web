import AceEditor from "react-ace";
import React, {useEffect, useRef} from "react";
import "ace-builds/src-noconflict/mode-plain_text";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/keybinding-vim"


import './SingleLineVimEditor.css'
import * as ace from "ace-builds";
import QMessageBox from "../../common/QMessageBox";


interface SingleLineVimEditorProps {
    id: string;
    onChange?: (value: string, event?: any) => void;
}

const SingleLineVimEditor: React.FC<SingleLineVimEditorProps> = (props: SingleLineVimEditorProps) => {

    const aceRef: any = useRef(null);

    useEffect(() => {
        if (aceRef.current) {
            const editor = aceRef.current.editor;
            if (editor) {
                console.log("init editor")

                ace.config.loadModule('ace/keyboard/vim', function (module) {

                    // Hook vim editor error message
                    module.CodeMirror.defineExtension("openNotification", function (arg0: HTMLElement, arg1: object) {
                        console.log(arg0, arg1)
                        window.python.showMessageBox(QMessageBox.Warning, "error", `${arg0.innerText}`, QMessageBox.Ok)
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

                // Remove newlines in pasted text
                editor.on("paste", function (e: any) {
                    e.text = e.text.replace(/[\r\n]+/g, " ");
                });
                // Adjust mouse position clipping
                editor.renderer.screenToTextCoordinates = function (x: number, y: number) {
                    var pos = this.pixelToScreenCoordinates(x, y);
                    return this.session.screenToDocumentPosition(
                        Math.min(this.session.getScreenLength() - 1, Math.max(pos.row, 0)),
                        Math.max(pos.column, 0)
                    );
                };
                // Disable Enter and Shift-Enter keys
                editor.commands.bindKey("Enter|Shift-Enter", "null");
            }
        }
    }, []);
    return (
        <div id="url-input-ace-editor-wrapper">
            <AceEditor
                setOptions={{useWorker: false}}
                fontSize={14}
                maxLines={1}
                mode="plain_text"
                theme="github"
                onChange={props.onChange}
                name={"url-input-" + props.id}
                showPrintMargin={false}
                showGutter={false}
                highlightActiveLine={false}
                editorProps={{$blockScrolling: true}}
                ref={aceRef}
                keyboardHandler={'vim'}
            />
        </div>
    )

}

export default SingleLineVimEditor;