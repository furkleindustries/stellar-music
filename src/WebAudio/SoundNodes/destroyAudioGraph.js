export const destroyAudioGraph = ({
  audioContext,
  nodes,
  parameterModulators,
  soundModulators,
}) => {
  audioContext.suspend();
  audioContext.destination.disconnect();

  Object.values(nodes).forEach((arg) => {
    const nodeArr = Array.isArray(arg) ? arg : [ arg ];
    nodeArr.forEach((node) => {
      node.disconnect();
    });
  });

  Object.values(soundModulators).forEach(({ node }) => {
    if (node) {
      if (typeof node.disconnect === 'function') {
        node.disconnect();
      } else if (Array.isArray(node)) {
        node.forEach(({ node }) => {
          if (typeof node.disconnect === 'function') {
            node.disconnect();
          }
        });
      }
    }
  });

  Object.values(parameterModulators).forEach(({ node }) => {
    if (node) {
      if (typeof node.disconnect === 'function') {
        node.disconnect();
      } else if (Array.isArray(node)) {
        node.forEach(({ node }) => {
          if (typeof node.disconnect === 'function') {
            node.disconnect();
          }
        });
      }
    }
  });
};
