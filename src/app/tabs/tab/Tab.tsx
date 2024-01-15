import React, {useEffect, useRef} from "react";
import QMessageBox from "../../../common/QMessageBox";
import {Breadcrumb, Button, Select, Space, theme} from "antd";
import {Content} from "antd/lib/layout/layout";

import * as ace from 'ace-builds';

import './Tab.css'
import SingleLineVimEditor from "../../editor/SingleLineVimEditor";


interface TabProps {
    id: string;
}

const Tab: React.FC<TabProps> = (props: TabProps) => {

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();


    function onChange() {
        console.log("onChange")
    }


    const options = [
        {
            value: 'get',
            label: 'GET',
        },
        {
            value: 'post',
            label: 'POST',
        },
    ];


    return (
        <div>
            <Breadcrumb style={{margin: '16px 0'}}>
                <Breadcrumb.Item>Collection</Breadcrumb.Item>
                <Breadcrumb.Item>API</Breadcrumb.Item>
                <Breadcrumb.Item>Post</Breadcrumb.Item>
            </Breadcrumb>
            <Space.Compact style={{width: '100%', marginBottom: 10}}>
                <Select defaultValue="post" options={options} style={{marginRight: 0, minWidth: 80}}/>
                <SingleLineVimEditor id={props.id} onChange={onChange}/>
                <Button type="primary">Send</Button>
            </Space.Compact>
            <Content
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                Content
            </Content>
        </div>
    )
}

export default Tab;