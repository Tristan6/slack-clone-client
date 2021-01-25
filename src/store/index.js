import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      debug: true,
      group: {
        groupID: "5fec04e96d55740010123439",
        groupName: "General"
      },
      user: null,
      socket: null,
      authenticated: false,
      modalOpen: false
    };
  },
  mutations: {
    setGroup(state, payload) {
      if (state.debug) {
        console.log("setGroup triggered with: ", payload);
      }
      state.group = {
        groupID: payload.groupID,
        groupName: payload.groupName
      };
    },
    async setUser(state) {
      if (state.debug) {
        console.log("setUser triggered");
      }
      let sessionToken = localStorage.getItem("auth");
      let url = "https://slack.api.tristanmacelli.com/v1/users/";
      let resp = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: sessionToken
        }
      });
      if (!resp.ok) {
        alert("Error: ", resp.status);
      }
      let user = await resp.json();
      state.user = user;
    },
    clearUser(state) {
      if (state.debug) {
        console.log("clearUser triggered");
      }
      state.user = null;
    },
    setSocket(state) {
      if (state.debug) {
        console.log("setSocket triggered");
      }
      let sessionToken = localStorage.getItem("auth");
      state.socket = new WebSocket(
        "wss://slack.api.tristanmacelli.com/v1/ws?auth=" + sessionToken
      );
      state.socket.onopen = function() {
        if (state.debug) {
          console.log("Successfully connected to the echo WebSocket server!");
        }
      };
      state.socket.onclose = close => {
        if (state.debug) {
          console.log("close: ", close);
          if (close.wasClean) {
            console.log(
              "Successfully disconnected to the echo WebSocket server!"
            );
          } else {
            console.log(
              "Not able to cleanly disconnected from the WebSocket server."
            );
          }
        }
      };
      state.socket.onerror = error => {
        if (state.debug) {
          console.log("error: ", error);
          console.log("Error originating from the echo websocket server...");
        }
      };
    },
    clearSocket(state) {
      if (state.debug) {
        console.log("clearSocket triggered");
      }
      // state.socket is defined && state.socket.readyState === WebSocket.OPEN
      // Close WebSocket connection
      state.socket.close();
      // Eventually this should be removed
      state.socket = null;
    },
    setAuthentication(state) {
      if (state.debug) {
        console.log("setAuthentication triggered");
      }
      state.authenticated = true;
    },
    clearAuthentication(state) {
      if (state.debug) {
        console.log("clearAuthentication triggered");
      }
      state.authenticated = false;
    },
    setModal(state) {
      if (state.debug) {
        console.log("setModal triggered");
      }
      state.modalOpen = true;
    },
    clearModal(state) {
      if (state.debug) {
        console.log("clearModal triggered");
      }
      state.modalOpen = false;
    }
  },
  getters: {
    getGroupID(state) {
      if (state.debug) {
        console.log("getGroupID triggered");
      }
      if (state.group) {
        return state.group.groupID;
      }
      return "";
    },
    getGroupName(state) {
      if (state.debug) {
        console.log("getGroupName triggered");
      }
      if (state.group) {
        return state.group.groupName;
      }
      return "";
    },
    getUserID(state) {
      if (state.user) {
        return state.user.id;
      }
      return "";
    },
    getUserFirstname(state) {
      if (state.user) {
        return state.user.FirstName;
      }
      return "";
    },
    getUserLastname(state) {
      if (state.user) {
        return state.user.LastName;
      }
      return "";
    },
    getSocket(state) {
      if (state.debug) {
        console.log("getSocket triggered");
      }
      return state.socket;
    },
    getAuthentication(state) {
      if (state.debug) {
        console.log("getAuthentication triggered");
      }
      return state.authenticated;
    }
  }
});

export default store;
