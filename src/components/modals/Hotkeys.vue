<template>
  <modal name="info-modal" :adaptive="true" height="auto" width="500px">
    <div id="hotkeys-modal">
      <table class="info-table">
        <tr v-for="(e, index) in events" :key="index" class="info-row">
          <td class="info-col-action" v-text="e.title"></td>
          <td class="info-col-hotkey" v-text="e.hotkey.join(' / ')"></td>
        </tr>
      </table>
    </div>
  </modal>
</template>

<script>
import { events } from "@/hotkeys";

export default {
  data() {
    return {
      events,
    };
  },
};
</script>

<style lang="scss" scoped>
#hotkeys-modal {
  z-index: 1;
  padding: 1rem;
  pointer-events: none;
  user-select: none;
}

.info-table {
  border-collapse: collapse;
  width: 100%;
}

.info-row:nth-child(odd) {
  background-color: rgba(167, 167, 167, 0.408);
}

.info-row > td {
  border: 1px solid black;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
}

.info-col-action {
  padding-right: 1rem;
  width: 50%;
  text-align: right;
}

.info-col-hotkey {
  padding-left: 1rem;
  width: 50%;
  text-align: left;
}
</style>
