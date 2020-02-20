<template>
  <div class="spinner" v-if="isLoading">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ConversationEvents, ConversationPart } from 'jovo-client-web-vue';

@Component({
  name: 'loading-spinner',
})
export default class LoadingSpinner extends Vue {
  isLoading: boolean = false;

  mounted() {
    this.$assistant.on(ConversationEvents.AddPart, (part: ConversationPart) => {
      if (part.type === 'request') {
        this.isLoading = true;
      } else if (part.type === 'response') {
        setTimeout(() => {
          this.isLoading = false;
        }, 300);
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.spinner {
  display: inline-block;
  height: 50px;
  margin-left: 15px;
  vertical-align: middle;
}

.spinner > div {
  width: 14px;
  height: 14px;
  background-color: #333;
  opacity: 0.5;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
  }
}

@keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>
