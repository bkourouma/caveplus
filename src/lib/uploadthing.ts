export function getUploadThingConfig() {
  return {
    enabled: Boolean(process.env.UPLOADTHING_TOKEN)
  };
}
