import { useCallback, useState,useRef } from 'react';
import ReactFlow, { applyEdgeChanges, applyNodeChanges, Background, MarkerType,updateEdge } from 'reactflow';
import 'reactflow/dist/style.css';



import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Button from '@mui/material/Button';

import TextUpdaterNode from './CustomNode.js';

import './overview.css'

const rfStyle = {
  backgroundColor: 'white',
};
var intialnodes = []
var intialedges = []
var index = 1
if(sessionStorage.getItem('Nodes'))
intialnodes = JSON.parse(sessionStorage.getItem('Nodes'))
if(sessionStorage.getItem('Edges'))
intialedges = JSON.parse(sessionStorage.getItem('Edges'))
if(sessionStorage.getItem('index'))
index = Number.parseInt(sessionStorage.getItem('index'))
// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = { textUpdater: TextUpdaterNode };

function Flow() {
  const edgeUpdateSuccessful = useRef(true);
  const [nodes, setNodes] = useState(intialnodes);
  const [edges, setEdges] = useState(intialedges);
  const [count, setcount] = useState(index)


  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => {
      console.log(connection)
      setEdges([...edges, {
        id: `e${connection.source}-${connection.target}`, source: `${connection.source}`, target: `${connection.target}`, markerEnd: {
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
    },[edges]
  );

  return (
    <div id='flow' style={{ width: '95vw', height: '95vh', display: 'flex', flexDirection: 'row' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        style={rfStyle}
      >
        <Background color="#aaa" gap={16} />

      </ReactFlow>
      
      <div id='attribute-panel'>
        <label> Name of the workflow </label>
        <input type='text' id='nodename' placeholder='Name of the node'></input>
        <Button onClick={() => {
          setNodes([...nodes, { id: `node-${count}`, type: 'textUpdater', position: { x: 0, y: 0 }, data: { value: `${document.getElementById('nodename').value}` } }])
          setcount(count + 1)
          console.log('here')
        }}>Add Node</Button> <br></br>
        <Button onClick={()=>{
          console.dir(nodes)
          console.dir(edges)
          sessionStorage.setItem('Nodes',JSON.stringify(nodes))
          sessionStorage.setItem('Edges',JSON.stringify(edges))
          sessionStorage.setItem('index',count)
        }}>Save</Button>

      </div>
    
    </div>
  );
}

export default Flow;