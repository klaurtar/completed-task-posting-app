const EventManager = (() => {
  const subscribers = {};

  // on - adEventLisenter
  const subscribe = (eventName, handler) => {
    if (!subscribers[eventName]) {
      subscribers[eventName] = [];
    }
    subscribers[eventName].push(handler);
  };

  // off - remoeEventlistener
  const unsubscribe = (eventName, handler) => {
    const handlers = subscribers[eventName];

    if(handlers !== false){
      const handlerIndex = handlers.indexOf(handler);
      handlers.splice(handlerIndex);
    }
  };

  // fire
  const publish = (eventName, data) => {
    if (subscribers[eventName]) {
      subscribers[eventName].forEach((handle) => {
        handle(data);
      });
    }
  };

  return {
    subscribe,
    unsubscribe,
    publish
  };
})();
