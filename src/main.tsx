import React, { useEffect, useState, useRef } from "react";
import { connect, RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import "datocms-react-ui/styles.css";
import { render } from "./utils/render";
import ConfigScreen from './ConfigScreen';

const FIELD_EXTENSION_ID = "treeSelector";



connect({
  manualFieldExtensions() {
    return [
      {
        id: FIELD_EXTENSION_ID,
        name: "Tree-Based Link Selector",
        type: "addon",
        configurable: false,
        fieldTypes: ["link"],
        initialHeight: 400,
      },
    ];
  },

  renderConfigScreen(ctx) {
    render(<ConfigScreen ctx={ctx} />, ctx);
  },

  renderFieldExtension(fieldExtensionId: string, ctx: RenderFieldExtensionCtx) {
    if (fieldExtensionId === FIELD_EXTENSION_ID) {
      const FieldExtensionComponent = () => {
        const [treeData, setTreeData] = useState<any[]>([]);
        const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
        const [loading, setLoading] = useState<boolean>(true);
        const selectedNodeIdRef = useRef<string | null>(
          typeof ctx.formValues[ctx.fieldPath] === "string"
            ? (ctx.formValues[ctx.fieldPath] as string | null)
            : null
        );

        // Fetch the global API token
        const apiToken = ctx.plugin.attributes.parameters.apiToken;

        if (!apiToken) {
          console.error("API token is not configured in plugin settings!");
          return <p>Please configure the API token in plugin settings.</p>;
        }

        const fetchData = async () => {
          try {
            const modelId = (ctx.field.attributes.validators.item_item_type as {
              item_types: string[];
            }).item_types[0];
        
            console.log("Model ID:", modelId);
        
            let allItems: any[] = [];
            let page = 1;
            const limit = 30; // Adjust if the API allows a higher limit
            let hasMore = true;
        
            while (hasMore) {
              const response = await fetch(
                `https://site-api.datocms.com/items?filter[type]=${modelId}&page[limit]=${limit}&page[offset]=${(page - 1) * limit}`,
                {
                  headers: {
                    Authorization: `Bearer ${apiToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-Api-Version": "3",
                  },
                }
              );
        
              if (!response.ok) {
                console.error(
                  `API returned status ${response.status}: ${response.statusText}`
                );
                return;
              }
        
              const data = await response.json();
        
              if (!data.data || !Array.isArray(data.data)) {
                console.error("Unexpected API response structure:", data);
                return;
              }
        
              // Log current batch
              console.log(`Fetched page ${page}:`, data.data);
        
              // Add current batch to allItems
              allItems = allItems.concat(
                data.data.map((item: any) => ({
                  ...item,
                  attributes: {
                    ...item.attributes,
                    name: item.attributes.name || `Untitled Record (${item.id})`, // Ensure name exists
                  },
                }))
              );
        
              // Check if there are more pages
              hasMore = data.data.length === limit;
              page++;
            }
        
            console.log("All items fetched:", allItems);
        
            // Build the tree structure
            const buildTree = (records: any[]) => {
              const map = new Map();
              const roots: any[] = [];
        
              records.forEach((item) => {
                map.set(item.id, { ...item, children: [] });
              });
        
              records.forEach((item) => {
                const parentId = item.attributes.parent_id;
                if (parentId) {
                  const parent = map.get(parentId);
                  if (parent) parent.children.push(map.get(item.id));
                } else {
                  roots.push(map.get(item.id));
                }
              });
        
              return roots;
            };
        
            const tree = buildTree(allItems);
        
            console.log("Built tree structure:", tree);
        
            setTreeData(tree);
        
            if (selectedNodeIdRef.current) {
              expandToNode(selectedNodeIdRef.current, tree);
            }
          } catch (error) {
            console.error("Error fetching records:", error.message, error.stack);
          } finally {
            setLoading(false);
          }
        };
        
        
        

        useEffect(() => {
          fetchData();
        }, []);

        const expandToNode = (nodeId: string, nodes: any[]) => {
          const newExpandedNodes = new Set(expandedNodes);

          const traverseTree = (currentNodes: any[]) => {
            for (const node of currentNodes) {
              if (node.id === nodeId) return true;
              if (node.children.length > 0 && traverseTree(node.children)) {
                newExpandedNodes.add(node.id);
                return true;
              }
            }
            return false;
          };

          traverseTree(nodes);
          setExpandedNodes(newExpandedNodes);
        };

        const toggleNode = (nodeId: string) => {
          setExpandedNodes((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) {
              newSet.delete(nodeId);
            } else {
              newSet.add(nodeId);
            }
            return newSet;
          });
        };

        const handleSelectNode = (node: any) => {
          if (node.children.length === 0) {
            selectedNodeIdRef.current = node.id;
            ctx.setFieldValue(ctx.fieldPath, node.id);
          } else {
            toggleNode(node.id);
          }
        };

        const renderTree = (nodes: any[], level = 0) =>
          nodes.map((node) => (
            <div key={node.id} style={{ marginLeft: `${level * 20}px` }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{ cursor: "pointer", marginRight: "8px" }}
                  onClick={() => toggleNode(node.id)}
                >
                  {node.children.length > 0
                    ? expandedNodes.has(node.id)
                      ? "▼"
                      : "▶"
                    : ""}
                </span>
                <span
                  onClick={() => handleSelectNode(node)}
                  style={{
                    cursor: node.children.length === 0 ? "pointer" : "default",
                    backgroundColor:
                      selectedNodeIdRef.current === node.id
                        ? "rgba(0, 123, 255, 0.2)"
                        : "transparent",
                    borderRadius: "4px",
                    padding: "5px",
                  }}
                >
                  {node.attributes.name || `Untitled Record (${node.id})`}
                </span>
              </div>
              {expandedNodes.has(node.id) && renderTree(node.children, level + 1)}
            </div>
          ));

        return (
          <div>
            {loading ? <p>Loading records...</p> : <div>{renderTree(treeData)}</div>}
          </div>
        );
      };

      render(<FieldExtensionComponent />, ctx);
    }
  },
});
