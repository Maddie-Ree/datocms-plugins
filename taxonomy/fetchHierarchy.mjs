import fetch from 'node-fetch';

const API_TOKEN = '21e755fe86a472cf2f5e41b8edbfd9'; // DatoCMS API token
const MODEL_ID = 'IM2s_1j6Qs2tJ0U52IRCFQ'; // Model ID for target records
const API_URL = `https://site-api.datocms.com/items`;

const fetchHierarchy = async () => {
  try {
    console.log('Fetching all records for the target model...');
    const response = await fetch(`${API_URL}?filter[type]=${MODEL_ID}`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Api-Version': '3',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error fetching records: ${errorText}`);
    }

    const data = await response.json();
    const items = data.data;

    console.log(`Fetched ${items.length} records.`);

    // Build the hierarchy
    const buildTree = (records) => {
      const map = new Map();
      const roots = [];

      // Initialize the map with all records
      records.forEach((item) => {
        map.set(item.id, { ...item, children: [] });
      });

      // Populate parent-child relationships
      records.forEach((item) => {
        const parentId = item.attributes.parent_id;
        if (parentId) {
          const parent = map.get(parentId);
          if (parent) parent.children.push(map.get(item.id));
        } else {
          roots.push(map.get(item.id)); // Parent nodes with no parent_id
        }
      });

      return roots;
    };

    const hierarchy = buildTree(items);

    console.log('\nHierarchy (parent-child structure):');
    const displayTree = (nodes, level = 0) => {
      nodes.forEach((node) => {
        console.log(`${' '.repeat(level * 2)}- ${node.attributes.name || `Untitled (${node.id})`}`);
        if (node.children.length > 0) {
          displayTree(node.children, level + 1);
        }
      });
    };

    displayTree(hierarchy);

    // Optionally display a flat list of records
    console.log('\nFlat List of Records:');
    items.forEach((item) => {
      console.log(
        `ID: ${item.id}, Name: ${item.attributes.name || 'Untitled'}, Parent ID: ${item.attributes.parent_id || 'None'}`
      );
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
};

fetchHierarchy();
