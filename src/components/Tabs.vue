<template>
  <div class="tabs-component">
    <ul role="tablist" class="tabs-component-tabs">
      <li
        v-for="(tab, i) in tabs"
        :key="i"
        :class="{ active: tab.isActive, disabled: tab.isDisabled }"
        class="tabs-component-tab"
        role="presentation"
        v-show="tab.isVisible"
        @click="selectTab(tab.hash, $event)"
      >
        <span
          v-html="tab.header"
          :aria-controls="tab.hash"
          :aria-selected="tab.isActive"
          :href="tab.hash"
          class="tabs-component-tab-a"
          role="tab"
        ></span>
      </li>
    </ul>
    <div class="tabs-component-panels">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cacheLifetime: {
      default: 5,
    },
    options: {
      type: Object,
      required: false,
      default: () => ({
        useUrlFragment: true,
        defaultTabHash: null,
      }),
    },
  },
  data: () => ({
    tabs: [],
    activeTabHash: "",
    activeTabIndex: 0,
    lastActiveTabHash: "",
  }),
  computed: {
    storageKey() {
      return `vue-tabs-component.cache.${window.location.host}${window.location.pathname}`;
    },
  },
  created() {
    this.tabs = this.$children;
  },
  mounted() {
    window.addEventListener("hashchange", () =>
      this.selectTab(window.location.hash)
    );
    if (this.findTab(window.location.hash)) {
      this.selectTab(window.location.hash);
      return;
    }
    const previousSelectedTabHash = "";
    if (this.findTab(previousSelectedTabHash)) {
      this.selectTab(previousSelectedTabHash);
      return;
    }
    if (
      this.options.defaultTabHash !== null &&
      this.findTab("#" + this.options.defaultTabHash)
    ) {
      this.selectTab("#" + this.options.defaultTabHash);
      return;
    }
    if (this.tabs.length) {
      this.selectTab(this.tabs[0].hash);
    }
  },
  methods: {
    findTab(hash) {
      return this.tabs.find((tab) => tab.hash === hash);
    },
    selectTab(selectedTabHash, event) {
      // See if we should store the hash in the url fragment.
      if (event && !this.options.useUrlFragment) {
        event.preventDefault();
      }
      const selectedTab = this.findTab(selectedTabHash);
      if (!selectedTab) {
        return;
      }
      if (selectedTab.isDisabled) {
        event.preventDefault();
        return;
      }
      if (this.lastActiveTabHash === selectedTab.hash) {
        this.$emit("clicked", { tab: selectedTab });
        return;
      }
      this.tabs.forEach((tab) => {
        tab.isActive = tab.hash === selectedTab.hash;
      });
      this.$emit("changed", { tab: selectedTab });
      this.activeTabHash = selectedTab.hash;
      this.activeTabIndex = this.getTabIndex(selectedTabHash);
      this.lastActiveTabHash = this.activeTabHash = selectedTab.hash;
    },
    setTabVisible(hash, visible) {
      const tab = this.findTab(hash);
      if (!tab) {
        return;
      }
      tab.isVisible = visible;
      if (tab.isActive) {
        // If tab is active, set a different one as active.
        tab.isActive = visible;
        this.tabs.every((tab) => {
          if (tab.isVisible) {
            tab.isActive = true;
            return false;
          }
          return true;
        });
      }
    },

    getTabIndex(hash) {
      const tab = this.findTab(hash);

      return this.tabs.indexOf(tab);
    },

    getTabHash(index) {
      const tab = this.tabs.find((tab) => this.tabs.indexOf(tab) === index);

      if (!tab) {
        return;
      }

      return tab.hash;
    },

    getActiveTab() {
      return this.findTab(this.activeTabHash);
    },

    getActiveTabIndex() {
      return this.getTabIndex(this.activeTabHash);
    },
  },
};
</script>
<style lang="scss" scoped>
.tabs-component-tabs {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  justify-content: space-around;
  gap: 0.5rem;

  .tabs-component-tab {
    flex: 1 1 50%;
    padding: 0.5rem 0;
    text-align: center;
    border-radius: 0.5rem;
    box-sizing: border-box;
    background-color: var(--primary-clr);
    &.active {
      border: 2px solid var(--secondary-clr);
    }

    &.disabled {
      border: 2px solid var(--primary-clr);
      background-color: white;
      color: grey;
      cursor: not-allowed;
    }
  }
}
.tabs-component-panel {
  padding: 0.5rem;
}
</style>
