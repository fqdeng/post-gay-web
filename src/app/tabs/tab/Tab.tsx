import React, {useEffect, useRef, useState} from "react";
import QMessageBoxEnum from "../../../common/QMessageBoxEnum";
import {Breadcrumb, Button, Flex, Select, Space, theme} from "antd";
import {Content} from "antd/lib/layout/layout";

import * as ace from 'ace-builds';

import './Tab.css'
import SingleLineVimEditor from "../../editor/SingleLineVimEditor";
import Editor, {VimEditorRef} from "../../editor/Editor";


interface TabProps {
    id: string;
}

const Tab: React.FC<TabProps> = (props: TabProps) => {


    const options = [
        {
            value: 'post',
            label: 'POST',
        },
        {
            value: 'get',
            label: 'GET',
        },

    ];

    const [url, setUrl] = useState("")
    const [body, setBody] = useState("")
    const [method, setMethod] = useState(options[0].value)

    const {
        token: {colorBorder, borderRadiusLG},
    } = theme.useToken();


    function onChangeURL(value: string, event?: any) {
        setUrl(value)
    }

    function onChangeBody(value: string, event?: any) {
        setBody(value)
    }


    const sendHttp = () => {
        console.log(`send http: url: ${url} body: ${body}`)
        if (url) {
            let fetchURL = url
            if (!(fetchURL.startsWith("http://") || fetchURL.startsWith("https://"))) {
                fetchURL = "http://" + fetchURL
            }
            //send post request
            fetch(fetchURL, {method: "get"}).then((response) => {
                console.log(response.text().then((text) => {
                    console.log(text)
                    responseEditorRef.current?.setValue(text)
                }))
            }).catch((error) => {
                console.log(error)
                responseEditorRef.current?.setValue(error.toString())
            })
        }

    }

    const responseEditorRef = useRef<VimEditorRef>();

    const methodChange = (value: string) => {
        console.log(`method change: ${value}`)
    }

    return (
        <div>
            <Flex vertical={true}>
                <Content
                    style={{
                        padding: 4,
                        marginBottom: 10,
                        borderBottom: `1px solid ${colorBorder}`,
                    }}
                >
                    <Breadcrumb style={{margin: '16px 0'}}>
                        <Breadcrumb.Item>Collection</Breadcrumb.Item>
                        <Breadcrumb.Item>API</Breadcrumb.Item>
                        <Breadcrumb.Item>Post</Breadcrumb.Item>
                    </Breadcrumb>
                    <Space.Compact style={{width: '100%', marginBottom: 10}}>
                        <Select defaultValue={options[0].value} options={options} onChange={methodChange}
                                style={{marginRight: 0, minWidth: 80}}/>
                        <SingleLineVimEditor id={props.id} onChange={onChangeURL}/>
                        <Button type="primary" onClick={sendHttp}>Send</Button>
                    </Space.Compact>

                    <Editor id={"request-editor-" + props.id} onChange={onChangeBody}></Editor>
                </Content>
                <Content style={{
                    padding: 4,
                }}>
                    <Editor id={"response-editor-" + props.id} ref={responseEditorRef}></Editor>
                </Content>
            </Flex>
        </div>
    )
}

export default Tab;