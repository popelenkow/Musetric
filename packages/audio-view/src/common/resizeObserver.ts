export const subscribeResizeObserver = (
  element: Element,
  callback: () => Promise<void>,
) => {
  let isEntry = true;
  const observer = new ResizeObserver(() => {
    if (isEntry) {
      isEntry = false;
      return;
    }
    callback();
  });
  observer.observe(element);
  return () => {
    observer.disconnect();
  };
};
