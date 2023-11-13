import { useCallback, useState } from 'react';
import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges, Background, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';

import TextUpdaterNode from './CustomNode.js';

import './overview.css'


const nodeTypes = { textUpdater: TextUpdaterNode };

function Flow() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [count, setcount] = useState(1)

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '50vw', height: '100vh', display: 'flex', flexDirection: 'row' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}

      >
        <Background color="#aaa" gap={16} />
      </ReactFlow>
      <div>
        <button onClick={() => {
          setNodes([...nodes, { id: `node-${count}`, type: 'textUpdater', position: { x: 0, y: 0 }, data: { value: `Stage-${count}` } }])
          if (count !== 1)
            setEdges([...edges, {
              id: `e${count - 1}-${count}`, source: `node-${count - 1}`, target: `node-${count}`, markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: 'black',
              },
              style: {
                strokeWidth: 1,
                stroke: 'green',
              },
              animated: true
            }])
          setcount(count + 1)
        }}>Add Node</button>
      </div>
    </div>
  );
}

export default Flow;
