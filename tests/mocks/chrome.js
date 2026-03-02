import { STORAGE_KEY } from "../../src/lib/constants.js";

export function createChromeMock(initialLinks = []) {
  const sendHeaderListeners = [];
  const state = {
    [STORAGE_KEY]: [...initialLinks]
  };

  return {
    storage: {
      local: {
        async get(key) {
          if (typeof key === "string") {
            return { [key]: state[key] };
          }
          return { ...state };
        },
        async set(values) {
          Object.assign(state, values);
        }
      }
    },
    webRequest: {
      onBeforeSendHeaders: {
        addListener(listener) {
          sendHeaderListeners.push(listener);
        }
      }
    },
    async __triggerBeforeSendHeaders(details) {
      for (const listener of sendHeaderListeners) {
        await listener(details);
      }
    },
    __getState() {
      return structuredClone(state);
    }
  };
}
