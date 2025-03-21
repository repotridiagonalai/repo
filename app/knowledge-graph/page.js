"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import neo4j from "neo4j-driver";
 
const ForceGraph2D = dynamic(
  () => import("react-force-graph").then((mod) => mod.ForceGraph2D),
  { ssr: false }
);
 
const colorPalette = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
  "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
];
 
const Neo4jGraph = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loadedNodes, setLoadedNodes] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
 
  useEffect(() => {
    if (typeof window !== "undefined") {
      require("aframe");
    }
 
   
 
    // const driver = neo4j.driver(
    //   "neo4j://15.206.238.170:7687",
    //   neo4j.auth.basic("neo4j", "Neo4j@123")
    // );
 
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
          nodes.push({ id: node.identity.low, level: 0, ...node.properties });
        });
        setGraphData({ nodes, links: [] });
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
      .run("MATCH (n)-[r]->(m) WHERE id(n) = $nodeId RETURN n, r, m", {
        nodeId: neo4j.int(node.id)
      })
      .then((result) => {
        const nodes = new Map(graphData.nodes.map((n) => [n.id, n]));
        const links = [...graphData.links];
 
        result.records.forEach((record) => {
          const node1 = record.get("n");
          const node2 = record.get("m");
          const relationship = record.get("r");
 
          const childLevel = (nodes.get(node1.identity.low)?.level || 0) + 1;
 
          nodes.set(node2.identity.low, {
            id: node2.identity.low,
            level: childLevel,
            ...node2.properties
          });
 
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
 
        setLoadedNodes((prev) => new Set(prev).add(node.id));
      })
      .catch((error) => {
        console.error("Error loading sub-nodes:", error);
      })
      .finally(() => session.close());
 
    setSelectedNode(node);
  };
 
  const getNodeColor = (node) => {
    const level = node.level || 0;
    return colorPalette[level % colorPalette.length];
  };
 
  const getTruncatedLabel = (text, maxLength) =>
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
 
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: darkMode ? "#121212" : "#fff",
        color: darkMode ? "#fff" : "#000"
      }}
    >
      <div style={{ flex: 1 }}>
        <ForceGraph2D
          width={1275}
          height={600}
          graphData={graphData}
          backgroundColor={darkMode ? "#1a1a1a" : "#ffffff"}
          nodeAutoColorBy={null}
          nodeCanvasObject={(node, ctx) => {
            const label =
              node.name ||
              node.Description ||
              node.Heat_Exchanger_ID ||
              "Unnamed";
            const color = getNodeColor(node);
 
            // Draw Node
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
            ctx.fill();
 
            // Draw Node Label
            const truncatedLabel = getTruncatedLabel(label, 5);
            ctx.font = "1px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = darkMode ? "#fff" : "#000";
            ctx.fillText(truncatedLabel, node.x, node.y);
          }}
          linkDirectionalArrowLength={5}
          linkDirectionalArrowRelPos={1}
          linkColor={() => (darkMode ? "#bbb" : "#444")} // ✅ Adjust link color based on dark mode
          onNodeClick={handleNodeClick}
          nodeLabel={(node) =>
            node.name || node.Description || node.Heat_Exchanger_ID || "Unnamed"
          }
        />
      </div>
 
      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          width: "300px",
          padding: "10px",
          borderLeft: darkMode ? "1px solid #444" : "1px solid #ccc",
          backgroundColor: darkMode ? "#222" : "#f9f9f9",
          color: darkMode ? "#fff" : "#000"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px"
          }}
        >
          <h3 style={{ margin: 0 }}>Node Properties</h3>
        </div>
 
        {selectedNode ? (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              color: darkMode ? "#ddd" : "#000"
            }}
          >
            <tbody>
              {Object.entries(selectedNode).map(
                ([key, value]) =>
                  ![
                    "fy", "fx", "vy", "vx", "y", "x", "index","timestamps","values", "__indexColor"
                  ].includes(key) && (
                    <tr key={key}>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "5px",
                          fontWeight: "bold",
                          backgroundColor: darkMode ? "#333" : "#fff"
                        }}
                      >
                        {key}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "5px",
                          backgroundColor: darkMode ? "#444" : "#fff"
                        }}
                      >
                        {String(value)}
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        ) : (
          <p>Click on a node to view its properties.</p>
        )}
      </div>
    </div>
  );
};
 
export default Neo4jGraph;
 
 