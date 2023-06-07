<template>
  <modal name="info-modal" :adaptive="true" height="auto" width="500px">
    <div id="modal">
      <table class="info-table">
        <tr v-for="(e, index) in events" :key="index" class="info-row">
          <td class="info-col-action" v-text="e.title"></td>
          <td class="info-col-hotkey" v-text="e.hotkey.join(' / ')"></td>
        </tr>
      </table>
    </div>
  </modal>
</template>
