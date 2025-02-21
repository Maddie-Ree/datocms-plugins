# DatoCMS Taxonomy Tree Selector

A plugin for DatoCMS that allows you to view a single selector taxonomy as a tree hieararchy.


## Configuration

Add a read-only API to the global settings of the plugin, this is used to fetch the taxonomy. You need to create the taxonomy as a model where records can be orginized as a tree. It must contain a field called "name" which will be the name of the different nodes of the tree. In the model with the selector, add a single link, refrence the taxonomy model and add the plugin. 

## Development

The plugin is built using [Vite.js](https://vitejs.dev/). This enables a fast
development workflow, where you see the changes as soon as you save a file. For
it to work, it needs to be rendered inside the DatoCMS interface.
