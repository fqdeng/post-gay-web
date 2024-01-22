import {Tabs} from 'antd';
import type {TabsProps} from 'antd';
import React, {useState} from "react";
import Tab from './tab/Tab';
import TabPane from "antd/es/tabs/TabPane";


const Tables: React.FC = () => {


    const [tabs, setTabs] = useState([
        {key: '1', title: 'Tab 1'},
        {key: '2', title: 'Tab 2'},
        {key: '3', title: 'Tab 3'},
    ]);

    return (
        <Tabs defaultActiveKey="1" style={{paddingLeft: 10}}>
            {tabs.map(tab => (
                <TabPane tab={tab.title} key={tab.key}>
                    <Tab id={tab.key}/>
                </TabPane>
            ))}
        </Tabs>
    );
}
export default Tables;
