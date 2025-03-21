"use client";
import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import neo4j from "neo4j-driver";

const ForceGraph2D = dynamic(() => import("react-force-graph").then(mod => mod.ForceGraph2D), { ssr: false });

const Neo4jGraph = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loadedNodes, setLoadedNodes] = useState(new Set());
  const [hoveredNode, setHoveredNode] = useState(null); // Track hovered node
  const fgRef = useRef(); 
  const [centerNodeId, setCenterNodeId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      require("aframe");
    }

    const driver = neo4j.driver(
      "neo4j://15.206.238.170:7687",
      neo4j.auth.basic("neo4j", "Neo4j@123")
    );

    const session = driver.session();

    session
      .run("MATCH (n) RETURN n LIMIT 1")
      .then((result) => {
        const nodes = [];
        result.records.forEach((record) => {
          const node = record.get("n");
          nodes.push({ id: node.identity.low, x: 0, y: 0, size: 20, ...node.properties });
        });

        setGraphData({ nodes, links: [] });
        setCenterNodeId(nodes[0].id);
      })
      .finally(() => session.close());
  }, []);

  const handleNodeClick = (node) => {
    if (loadedNodes.has(node.id)) return;

    const driver = neo4j.driver(
      "neo4j://15.206.238.170:7687",
      neo4j.auth.basic("neo4j", "Neo4j@123")
    );
    const session = driver.session();

    session
      .run(
        "MATCH (n)-[r]->(m) WHERE id(n) = $nodeId RETURN n, r, m",
        { nodeId: neo4j.int(node.id) }
      )
      .then((result) => {
        const nodes = new Map(graphData.nodes.map(n => [n.id, n]));
        const links = [...graphData.links];

        result.records.forEach((record) => {
          const node1 = record.get("n");
          const node2 = record.get("m");
          const relationship = record.get("r");

          if (!nodes.has(node2.identity.low)) {
            nodes.set(node2.identity.low, { id: node2.identity.low, size: 10, ...node2.properties });
          }

          links.push({
            source: node1.identity.low,
            target: node2.identity.low,
            name: relationship.type
          });
        });

        setGraphData({
          nodes: Array.from(nodes.values()),
          links: links
        });

        setLoadedNodes(prev => new Set(prev).add(node.id));
      })
      .finally(() => session.close());
  };

  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={graphData}
      nodeAutoColorBy="id"
      linkDirectionalArrowLength={5}
      linkDirectionalArrowRelPos={1}
      onNodeClick={handleNodeClick}
      onNodeHover={(node) => setHoveredNode(node)} // Track hovered node
      nodeCanvasObject={(node, ctx, globalScale) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.id === centerNodeId ? 10 : 5, 0, 2 * Math.PI, false);
        ctx.fillStyle = node.id === centerNodeId ? "blue" : "grey";
        ctx.fill();

        if (node === hoveredNode) {
          // Display label only on hover
          const label = node.name || node.Description || node.Heat_Exchanger_ID || "Unnamed";
          ctx.font = `${Math.max(6, 12 / globalScale)}px Sans-Serif`;
          ctx.fillStyle = "red";
          ctx.textAlign = "center";
          ctx.fillText(label, node.x, node.y - 10);
        }
      }}
    />
  );
};

export default Neo4jGraph;