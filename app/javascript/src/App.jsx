import React, { useEffect, useState, useRef } from "react";

const hasChildren = ({ node, nodes }) =>
  nodes.some((item) => item.parent_id === node.id);
const getChildren = ({ node, nodes }) =>
  nodes.filter((item) => item.parent_id === node.id);

const Level = ({ nodes, parent, draggingNode }) => {
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
    draggingNode.current = { nodeId, parentId };
    console.log('nodeId: ', nodeId);
    console.log('parentId: ', parentId);
    console.log(e.target.innerHTML);
  };

  return (
    <>
      {name}
      <ul>
        {getChildren({ node: parent, nodes }).map((child) => (
          <li
            key={child.id}
            onDragStart={(e) => handleDragStart(e, child.id, parent.id)}
            draggable
          >
            <Level
              nodes={nodes}
              parent={child}
              draggingNode={draggingNode}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

const App = () => {
  const draggingNode = useRef();
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

  return (
    <>
      <h1>Org Chart</h1>
      {nodes ? (
        <Level
          nodes={nodes}
          parent={nodes.find((node) => node.root)}
          draggingNode={draggingNode}
        />
      ) : (
        "loading..."
      )}
    </>
  );
};

export default App;
