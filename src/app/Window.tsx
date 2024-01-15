import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import './Window.css'
import {FolderAddOutlined, HistoryOutlined, InboxOutlined} from '@ant-design/icons';
import {Layout, Menu, theme} from 'antd';
import Search from "antd/es/input/Search";
import {SearchProps} from "antd/lib/input";


import SideCollectionTree from "./side-menu/SideCollectionTree";
import Tables from "./tabs/Tabs";

const {Header, Content, Sider} = Layout;


export interface WindowRef {
    pythonWorldInit: () => void
}

const Window = forwardRef<WindowRef | undefined>((props, ref) => {
    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const sideCollectionTreeRef = useRef<SideCollectionTreeRef>();

    const pythonWorldInit = () => {
        sideCollectionTreeRef.current?.pythonWorldInit();
    }

    useImperativeHandle(ref, () => ({
        // 这里可以暴露任何必要的函数或值
        pythonWorldInit: pythonWorldInit,
    }));


    const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);


    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);

        // Set up the event listener
        window.addEventListener('resize', handleResize);

        // Clean up the event listener
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const siderWidthPercent = 25; // Example: 20% of window width
    const siderWidth = (windowWidth * siderWidthPercent) / 100;


    return (
        <Layout className="fullHeightLayout">
            <Header style={{display: 'flex', alignItems: 'center', padding: 10}}>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    style={{flex: 5, minWidth: 0, paddingLeft: 20}}
                >
                    <Menu.Item key="collections" icon={<FolderAddOutlined/>}>
                        Collections
                    </Menu.Item>
                    <Menu.Item key="environment" icon={<InboxOutlined/>}>
                        Environment
                    </Menu.Item>
                    <Menu.Item key="history" icon={<HistoryOutlined/>}>
                        History
                    </Menu.Item>
                </Menu>
                <Search placeholder="Search Post Gay" onSearch={onSearch} style={{flex: 1}}/>
            </Header>
            <Layout>
                <Sider style={{background: colorBgContainer}} width={siderWidth}>
                    <SideCollectionTree ref={sideCollectionTreeRef}/>
                </Sider>
                <Layout style={{padding: '0 24px 24px'}}>
                    <Tables></Tables>
                </Layout>
            </Layout>
        </Layout>
    );
});

export default Window;