const envPath = process.env.FILE_CODE;

export const systemConfig = {
  length: null,
};

export function getEnvTableConfig() {
  return import(`./config/config-${envPath}.js`);
}
