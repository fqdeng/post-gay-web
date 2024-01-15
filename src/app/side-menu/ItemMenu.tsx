import React, {Key, useState} from "react";
import {Dropdown, Menu, MenuProps, TreeDataNode} from "antd";
import {InboxOutlined, ApiOutlined} from "@ant-design/icons";


interface ItemMenuProps {
    removeNode: (key: Key) => void;
    createNode: (nodeData: TreeDataNode) => void;
    nodeData: TreeDataNode;
    setTreeItemMenuVisible: (flag: boolean) => void;
}

const ItemMenu: React.FC<ItemMenuProps> = (props) => {
    const [visible, setVisible] = useState(false)

    const [clickPosition, setClickPosition] = useState({x: 0, y: 0});

    const handleSingleNodeRightClick = (event: any) => {
        event.stopPropagation()
        setClickPosition({x: event.clientX, y: event.clientY});
        props.setTreeItemMenuVisible(true);
        setVisible(true);
    };

    const items: MenuProps['items'] = [
        {
            label: 'Rename',
            key: '0',
        },
        {
            label: 'Delete',
            key: '1',
        },
        {
            label: 'Create',
            key: '2',
        }
    ];

    // Curried function for handling menu click
    const handleMenuClick = (nodeData: TreeDataNode) =>
        (e: any) => {
            // Prevent node selection
            e.domEvent.stopPropagation()

            let label = ""
            switch (e.key) {
                case '0':
                    // Handle rename action
                    label = "Rename"
                    break;
                case '1':
                    // Handle delete action
                    label = "Delete"
                    props.removeNode(nodeData.key);
                    break;
                case '2':
                    // Handle create action
                    label = "Create a API"
                    props.createNode(nodeData);
                    break;
                default:
                // Handle default action
            }
            console.log(`Menu item clicked lable: ${label}, Node key ${nodeData.key} `);
        };

    return (
        <div onContextMenu={handleSingleNodeRightClick} style={{display: "inline-block"}}>
            <Dropdown visible={visible} overlay={<Menu items={items} onClick={handleMenuClick(props.nodeData)}/>}
                      onVisibleChange={(flag) => {
                          setVisible(flag);
                          props.setTreeItemMenuVisible(flag)
                      }}
                      trigger={['contextMenu']}
                      overlayStyle={{
                          position: 'fixed',
                          left: `${clickPosition.x}px`,
                          top: `${clickPosition.y}px`
                      }}
            >
                <div> {(props.nodeData as any).isLeaf ? <ApiOutlined/> : <InboxOutlined/>
                } {(props.nodeData as any).title}</div>
            </Dropdown>
        </div>
    );
}

export default ItemMenu;