import React, {forwardRef, useEffect, useImperativeHandle, useMemo, useState} from 'react';
import {Input, MenuProps, Tree, TreeDataNode, Dropdown, Menu} from 'antd';
import type {DataNode, TreeProps} from 'antd/es/tree';
import './SideCollectionTree.css'
import {v4 as uuidv4} from 'uuid';
import QMessageBox from "../../common/QMessageBox";
import {QWebChannel} from "../../qt/qwebchannel";
import ItemMenu from "./ItemMenu";

const {Search} = Input;

const {DirectoryTree} = Tree;


// Init the data
const generateData = () => {
    const treeData: TreeDataNode[] = [
        {
            title: 'parent 0',
            key: '0-0',
            isLeaf: false,
            children: [
                {title: 'leaf 0-0', key: '0-0-0', isLeaf: true},
                {title: 'leaf 0-1', key: '0-0-1', isLeaf: true},
            ],
        },
        {
            title: 'parent 1',
            key: '0-1',
            isLeaf: false,
            children: [
                {title: 'leaf 1-0', key: '0-1-0', isLeaf: true},
                {title: 'leaf 1-1', key: '0-1-1', isLeaf: true},
            ],
        },
        {
            title: 'parent 2',
            key: '0-2',
            isLeaf: false,
            children: [
                {title: 'leaf 2-0', key: '0-2-0', isLeaf: true},
                {title: 'leaf 2-1', key: '0-2-1', isLeaf: true},
            ],
        }

    ];
    return treeData;
};

// Flat the tree
const generateList = (data: DataNode[]) => {
    let dataList: { key: React.Key; title: string; isLeaf: boolean }[] = [];
    for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const {key, isLeaf} = node;
        dataList.push({key, title: key as string, isLeaf: isLeaf as boolean});
        if (node.children) {
            dataList = dataList.concat(generateList(node.children));
        }
    }
    return dataList;
};

const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
    let parentKey: React.Key;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some((item) => item.key === key)) {
                parentKey = node.key;
            } else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children);
            }
        }
    }
    return parentKey!;
};


interface SideCollectionTreeProps {

}

declare global {
    interface SideCollectionTreeRef {
        pythonWorldInit: () => void
    }
}

const SideCollectionTree =
    forwardRef<SideCollectionTreeRef | undefined, SideCollectionTreeProps>((props, ref) => {

        const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
        const [searchValue, setSearchValue] = useState('');
        const [autoExpandParent, setAutoExpandParent] = useState(true);
        const [gData, setGData] = useState(generateData());


        const saveCollections = () => {
            if (window.python) {
                window.python.saveFile('./collections.json', JSON.stringify(gData, null, 2));
            }
        }

        const pythonWorldInit = () => {
            window.python.readFile('./collections.json').then((content: string) => {
                const data: Array<any> = JSON.parse(content)
                setGData([...data]);
            })
            console.log("load collections");
        }

        useImperativeHandle(ref, () => ({
            pythonWorldInit: pythonWorldInit,
        }));


        // Custom render function
        const renderTreeTitle = (nodeData: TreeDataNode) => {
            return <ItemMenu removeNode={removeNode} createNode={createNode} nodeData={nodeData}
                             setTreeItemMenuVisible={setTreeItemMenuVisible}/>
        };

        const onExpand = (newExpandedKeys: React.Key[]) => {
            setExpandedKeys(newExpandedKeys);
            setAutoExpandParent(false);
        };

        const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const {value} = e.target;
            const newExpandedKeys = generateList(gData)
                .map((item) => {
                    if (item.title.indexOf(value) > -1) {
                        return getParentKey(item.key, gData);
                    }
                    return null;
                })
                .filter((item, i, self): item is React.Key => !!(item && self.indexOf(item) === i));
            setExpandedKeys(newExpandedKeys);
            setSearchValue(value);
            setAutoExpandParent(true);
        };

        const treeData = useMemo(() => {
            const loop = (data: DataNode[]): DataNode[] =>
                data.map((item) => {
                    const strTitle = item.title as string;
                    const index = strTitle.indexOf(searchValue);
                    const beforeStr = strTitle.substring(0, index);
                    const afterStr = strTitle.slice(index + searchValue.length);
                    const title =
                        index > -1 ? (
                            <span>
                                {beforeStr}
                                <span className="site-tree-search-value"
                                      style={{display: "inline-block"}}>{searchValue}</span>
                                {afterStr}
                            </span>
                        ) : (
                            <span> {strTitle}</span>
                        );
                    if (item.children) {
                        return {title, key: item.key, isLeaf: item.isLeaf, children: loop(item.children)};
                    }

                    return {
                        title,
                        key: item.key,
                        isLeaf: item.isLeaf,
                    };
                });

            return loop(gData);
        }, [searchValue, gData]);

        const onDragEnter: TreeProps['onDragEnter'] = (info) => {
            console.log(info);
            // expandedKeys, set it when controlled is needed
            // setExpandedKeys(info.expandedKeys)
        };

        // Simple loop for all tree node
        const loop = (
            data: DataNode[],
            key: React.Key,
            callback: (node: DataNode, i: number, data: DataNode[]) => void,
        ) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].key === key) {
                    return callback(data[i], i, data);
                }
                if (data[i].children) {
                    loop(data[i].children!, key, callback);
                }
            }
        };

        const findNode = (data: TreeDataNode[], key: React.Key, callback: (node: DataNode, i: number, data: DataNode[]) => void,): DataNode | null => {
            let specificNode: DataNode | null = null;
            loop(data, key, (item, index, arr) => {
                specificNode = item;
                callback(item, index, arr);
            });
            return specificNode;
        }

        const removeNode = (key: React.Key): DataNode | null => {
            const data = [...gData];
            let removedNode = findNode(data, key, (item, index, arr) => {
                arr.splice(index, 1);
            });
            setGData(data);
            saveCollections()
            return removedNode;
        }

        function createNode(nodeData: TreeDataNode) {
            let data = [...gData];
            if (nodeData.isLeaf) {
                window.python.showMessageBox(QMessageBox.Warning, "error", `you can't create a node in leaf node`, QMessageBox.Ok)
            } else if (nodeData.key) {
                let uuid = uuidv4();
                findNode(data, nodeData.key, (item, index, arr) => {
                    if (item && item.children) {
                        item.children.push({title: uuid, key: uuid, isLeaf: true});
                    }
                });
                console.log(`create node ${uuid} in node ${nodeData.key}`)
            }
            setGData(data);
            saveCollections()
        }

        const onDrop: TreeProps['onDrop'] = (info) => {
            console.log(info);
            const dropKey = info.node.key;
            const dragKey = info.dragNode.key;
            const dropPos = info.node.pos.split('-');
            const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);


            const data = [...gData];

            // Find dragObject
            let dragObj: DataNode;
            loop(data, dragKey, (item, index, arr) => {
                arr.splice(index, 1);
                dragObj = item;
            });

            if (!info.dropToGap && !info.node.isLeaf) {
                // Drop on the content
                loop(data, dropKey, (item) => {
                    item.children = item.children || [];
                    // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
                    item.children.unshift(dragObj);
                });
            } else if (
                //((info.node as any).props.children || []).length > 0 && // Has children
                !(info.node as any).props.isLeaf &&
                (info.node as any).props.expanded && // Is expanded
                dropPosition === 1 // On the bottom gap
            ) {
                loop(data, dropKey, (item) => {
                    item.children = item.children || [];
                    // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
                    item.children.unshift(dragObj);
                    // in previous version, we use item.children.push(dragObj) to insert the
                    // item to the tail of the children
                });
            } else {
                let ar: DataNode[] = [];
                let i: number;
                loop(data, dropKey, (_item, index, arr) => {
                    ar = arr;
                    i = index;
                });
                if (dropPosition === -1) {
                    ar.splice(i!, 0, dragObj!);
                } else {
                    ar.splice(i! + 1, 0, dragObj!);
                }
            }
            console.log(data)
            setGData(data);
        };


        const fullDirectoryTreeMenuItems: MenuProps['items'] = [
            {
                label: 'Create a Root Collection',
                key: '0',
            },
        ]

        const fullDirectoryTreeMenuClickHandler = (e: any) => {
            console.log(`fullDirectoryTreeMenuHandleClick: ${e.key}`)
            setFullDirectoryTreeMenuVisible(false);
        }

        const handleRightClick = (event: any) => {
            setFullDirectoryTreeMenuVisible(true);
        };

        const [fullDirectoryTreeMenuVisible, setFullDirectoryTreeMenuVisible] = useState(false);
        const [treeItemMenuVisible, setTreeItemMenuVisible] = useState(false);

        return (
            <div style={{height: "100%"}}>
                <Search style={{marginBottom: 8}} placeholder="Search" onChange={onChange}/>

                <Dropdown visible={fullDirectoryTreeMenuVisible && !treeItemMenuVisible}
                          onVisibleChange={(flag) => setFullDirectoryTreeMenuVisible(flag)} overlay={
                    <Menu items={fullDirectoryTreeMenuItems} onClick={fullDirectoryTreeMenuClickHandler}/>
                } trigger={['contextMenu']}>
                    <div style={{overflow: "auto", height: "100%"}} onContextMenu={handleRightClick}>
                        <Tree
                            style={{overflow: "auto", height: "100%"}}

                            className="draggable-tree"
                            onExpand={onExpand}
                            expandedKeys={expandedKeys}
                            autoExpandParent={autoExpandParent}
                            treeData={treeData}

                            draggable
                            blockNode

                            onDragEnter={onDragEnter}
                            onDrop={onDrop}

                            showLine={true}

                            titleRender={renderTreeTitle}
                        />
                    </div>
                </Dropdown>
            </div>
        );
    });

export default SideCollectionTree;