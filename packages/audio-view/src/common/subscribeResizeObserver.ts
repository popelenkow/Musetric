export const subscribeResizeObserver = (
  element: Element,
  callback: () => Promise<void>,
) => {
  callback();
  const observer = new ResizeObserver(callback);
  observer.observe(element);
  return () => {
    observer.disconnect();
  };
};
