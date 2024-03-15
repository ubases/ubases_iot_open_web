import { builder, mockGet } from '@/mock/util'

const detail = () => {
  return builder( { "interfaceConf":[]
  }, "ok", 0);
};
mockGet('', detail);