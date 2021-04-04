<template>
  <div class="docs" v-on-clickaway:mousedown="close">
    <button class="doc-menu-toggle" @click="showMenu = !showMenu">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-file-earmark-text"
        viewBox="0 0 16 16"
      >
        <path
          d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"
        />
        <path
          d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"
        />
      </svg>
    </button>
    <div class="doc-menu" v-show="showMenu">
      <button class="doc-new" @click="emit('doc-create')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-file-earmark-plus"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5z"
          />
          <path
            d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"
          />
        </svg>
      </button>
      <div class="doc-list">
        <div
          class="doc"
          :class="{ active: activeDoc(doc.id) }"
          v-for="doc in store.documents"
          :key="doc.id"
          @click="activeDoc(doc.id) ? null : emit('doc-select', doc.id)"
        >
          <span>{{ doc.name }}</span>
          <span>
            <span>{{ timeAgo(doc.lastEdit) }}</span>
            <button @click="emit('doc-delete', doc.id)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-trash"
                viewBox="0 0 16 16"
              >
                <path
                  d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                />
                <path
                  fill-rule="evenodd"
                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                />
              </svg>
            </button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { store } from "@/store";
import { mixin as clickaway } from "vue-clickaway2";
export default {
  name: "DocumentsList",
  mixins: [clickaway],
  data() {
    return {
      store,
      showMenu: false,
    };
  },
  methods: {
    emit(event, ...args) {
      this.$emit(event, args);
    },
    activeDoc(id) {
      return id === store.document?.id;
    },
    timeAgo(ts) {
      const date = new Date(ts);
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${date.getHours()}:${date.getMinutes()} ${date.getDate()} ${
        months[date.getMonth()]
      }`;
    },
    close() {
      if (this.showMenu) this.showMenu = false;
    },
  },
};
</script>
<style lang="scss" scoped>
button {
  padding: 0.5rem;
  border-radius: 0.4rem;
  border: none;
  z-index: 1;
  color: black;
  background-color: var(--node-bg-clr);
  box-shadow: 0px 0px 5px -2px black;
}

button:active {
  top: 1.07rem;
  background-color: var(--primary-clr);
  box-shadow: 0px 0px 4px -2px black;
  border: none;
}

button:focus {
  background-color: var(--primary-clr);
  outline: none;
}

.docs {
  top: 1rem;
  left: 1rem;
  position: absolute;
  z-index: 10;
  display: flex;
  align-items: flex-start;
  user-select: none;

  .doc-menu {
    background-color: white;
    border-radius: 0.2rem;
    position: relative;
    margin-left: 1rem;
    padding: 0.5rem;
  }

  .doc-list {
    background-color: #fff;
    padding: 0.2rem;
    border-radius: 0.2rem;
    margin-top: 0.5rem;

    .doc {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 0.5rem;
      align-items: center;
      padding: 0.2rem;
      border-radius: 0.2rem;
      span {
        padding: 0;
        margin: 0;
      }

      button {
        margin-left: 0.5rem;
      }
    }
    .doc:not(:last-child) {
      margin-bottom: 0.5rem;
    }
    .doc.active {
      color: var(--primary-clr);
      background-color: var(--secondary-clr);
    }
  }
}
</style>
