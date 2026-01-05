export const formatNodes = (apiNodes: any[]) =>
  apiNodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: {
      name: node.name, 
      ...node.data,
    },
  }))
export const formatEdges = (apiEdges: any[]) =>
  apiEdges.map((edge) => ({
    id: edge.id,
    source: edge.fromNodeId,
    target: edge.toNodeId,
    sourceHandle: edge.from_output ?? "main",
    targetHandle: edge.to_output ?? "main",
  }))