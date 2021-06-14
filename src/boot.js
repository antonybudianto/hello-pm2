process.on("SIGTERM", () => {
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("sigint anak");
  process.exit(0);
});

async function prepareNewRelic() {
  // console.log("prepareNR");
}

(async () => {
  await prepareNewRelic();

  require("./app");
})();
