import React from 'react';

const C = {
  node: '#1a2d35',
  border: '#2a4a58',
  text: '#94b8c4',
  arrow: '#2a6a7a',
  label: '#526670',
};

const Marker = ({ id }) => (
  <marker id={id} markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
    <polygon points="0 0, 6 3, 0 6" fill={C.arrow} />
  </marker>
);

const Node = ({ x, y, w, h = 20, label }) => (
  <>
    <rect x={x} y={y} width={w} height={h} rx="3" fill={C.node} stroke={C.border} strokeWidth="1" />
    <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="central"
      fill={C.text} fontFamily="monospace" fontSize="9">{label}</text>
  </>
);

const Arr = ({ x1, y1, x2, y2, m }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.arrow} strokeWidth="1.5" markerEnd={`url(#${m})`} />
);

export const SovereignSreDiagram = () => (
  <svg viewBox="0 0 296 110" width="100%" xmlns="http://www.w3.org/2000/svg">
    <defs><Marker id="m-sre" /></defs>
    <Node x={4} y={8} w={62} label="Monitor" />
    <Arr x1={66} y1={18} x2={84} y2={18} m="m-sre" />
    <Node x={84} y={8} w={68} label="AI Agent" />
    <Arr x1={152} y1={18} x2={170} y2={18} m="m-sre" />
    <Node x={170} y={8} w={118} label="Codebase Analysis" />
    <Arr x1={118} y1={28} x2={118} y2={58} m="m-sre" />
    <Node x={84} y={58} w={88} label="Human Gate" />
    <Arr x1={172} y1={68} x2={192} y2={68} m="m-sre" />
    <Node x={192} y={58} w={78} label="Fix Deploy" />
    <text x={4} y={104} fill={C.label} fontFamily="monospace" fontSize="8">
      Prometheus · LangGraph · CrewAI · ArgoCD
    </text>
  </svg>
);

export const DocuMindDiagram = () => (
  <svg viewBox="0 0 380 110" width="100%" xmlns="http://www.w3.org/2000/svg">
    <defs><Marker id="m-doc" /></defs>
    <Node x={4} y={8} w={54} label="User Query" />
    <Arr x1={58} y1={18} x2={78} y2={18} m="m-doc" />
    <Node x={78} y={8} w={82} label="Hybrid RAG" />
    <Arr x1={160} y1={18} x2={178} y2={18} m="m-doc" />
    <Node x={178} y={8} w={108} label="LangGraph Agents" />
    <Arr x1={286} y1={18} x2={304} y2={18} m="m-doc" />
    <Node x={304} y={8} w={72} label="Cited Report" />
    <Arr x1={112} y1={28} x2={90} y2={53} m="m-doc" />
    <Arr x1={126} y1={28} x2={198} y2={53} m="m-doc" />
    <Node x={48} y={55} w={84} label="Dense / ChromaDB" />
    <Node x={158} y={55} w={82} label="Sparse / LanceDB" />
    <text x={4} y={104} fill={C.label} fontFamily="monospace" fontSize="8">
      LangGraph · CrewAI · ChromaDB · LanceDB
    </text>
  </svg>
);

export const VectorGazeDiagram = () => (
  <svg viewBox="0 0 348 110" width="100%" xmlns="http://www.w3.org/2000/svg">
    <defs><Marker id="m-vg" /></defs>
    <Node x={4} y={8} w={62} label="Video Frame" />
    <Arr x1={66} y1={18} x2={86} y2={18} m="m-vg" />
    <Node x={86} y={8} w={82} label="CLIP Embed" />
    <Arr x1={168} y1={18} x2={188} y2={18} m="m-vg" />
    <Node x={188} y={8} w={88} label="LanceDB Search" />
    <Arr x1={276} y1={18} x2={294} y2={18} m="m-vg" />
    <Node x={294} y={8} w={50} label="Alert" />
    <Node x={86} y={55} w={82} label="NL Query" />
    <Arr x1={127} y1={55} x2={127} y2={30} m="m-vg" />
    <text x={4} y={104} fill={C.label} fontFamily="monospace" fontSize="8">
      Zero-Shot · Apple Silicon · Moondream2
    </text>
  </svg>
);
