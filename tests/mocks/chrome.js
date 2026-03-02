import { STORAGE_KEY } from "../../src/lib/constants.js";

export function createChromeMock(initialLinks = []) {
  const listeners = [];
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
      onBeforeRequest: {
        addListener(listener) {
          listeners.push(listener);
        }
      }
    },
    async __triggerBeforeRequest(details) {
      for (const listener of listeners) {
        await listener(details);
      }
    },
    __getState() {
      return structuredClone(state);
    }
  };
}
