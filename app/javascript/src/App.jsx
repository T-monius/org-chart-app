import React, { useEffect, useState, useRef } from "react";

const hasChildren = ({ node, nodes }) =>
  nodes.some((item) => item.parent_id === node.id);
const getChildren = ({ node, nodes }) =>
  nodes.filter((item) => item.parent_id === node.id);

const Level = ({ nodes, handleNodeChange, parent, draggingNodeInfo, dragOverNodeInfo }) => {
  const name = parent.last_name ? (
    <div className="name">
      {parent.first_name} {parent.last_name}
    </div>
  ) : null;

  if (!hasChildren({ nodes, node: parent })) {
    return name;
  }

  const handleDragStart = (e, nodeId, parentId) => {
    e.stopPropagation();
    draggingNodeInfo.current = { nodeId, parentId };
  };

  const handleDragEnter = (e, nodeId, parentId) => {
    e.stopPropagation();
    dragOverNodeInfo.current = { nodeId, parentId };
  }

  const handleDragEnd = (e) => {
    e.stopPropagation();
    const newParentId = dragOverNodeInfo.current.parentId;
    const nodesCopy = [...nodes];
    const draggingNode = nodesCopy.find((node) => node.id === draggingNodeInfo.current.nodeId);

    draggingNode.parent_id = newParentId;
    handleNodeChange(nodesCopy);
  };

  return (
    <>
      {name}
      <ul>
        {getChildren({ node: parent, nodes }).map((child) => (
          <li
            key={child.id}
            onDragStart={(e) => handleDragStart(e, child.id, parent.id)}
            onDragEnter={(e) => handleDragEnter(e, child.id, parent.id)}
            onDragEnd={(e) => handleDragEnd(e)}
            draggable
          >
            <Level
              nodes={nodes}
              handleNodeChange={handleNodeChange}
              parent={child}
              draggingNodeInfo={draggingNodeInfo}
              dragOverNodeInfo={dragOverNodeInfo}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

const App = () => {
  const draggingNodeInfo = useRef();
  const dragOverNodeInfo = useRef();
  const [nodes, setNodes] = useState(null);

  useEffect(() => {
    fetch("/nodes", {
      method: "GET",
      headers: new window.Headers({
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setNodes(data);
      });
  }, []);

  const handleNodeChange = (nodes) => {
    setNodes(nodes);
  };

  return (
    <>
      <h1>Org Chart</h1>
      {nodes ? (
        <Level
          nodes={nodes}
          handleNodeChange={handleNodeChange}
          parent={nodes.find((node) => node.root)}
          draggingNodeInfo={draggingNodeInfo}
          dragOverNodeInfo={dragOverNodeInfo}
        />
      ) : (
        "loading..."
      )}
    </>
  );
};

export default App;
