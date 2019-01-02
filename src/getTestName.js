module.exports = function getTestName(context) {
  let ctxPath = [context.title];
  let stepParent = context.runnable.parent;
  while (stepParent) {
    if (stepParent.title) {
      ctxPath.unshift(stepParent.title);
    }
    stepParent = stepParent.parent;
  }
  return ctxPath.join('/').trim();
};
