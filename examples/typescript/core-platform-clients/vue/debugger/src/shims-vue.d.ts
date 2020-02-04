declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

type PluginFunction<T> = (Vue: any, options?: T) => void;

interface PluginObject<T> {
  install: PluginFunction<T>;

  [key: string]: any;
}

declare module 'element-ui/lib/locale/lang/en';
declare module 'vue-beautiful-chat';
declare module 'vue-json-viewer';
