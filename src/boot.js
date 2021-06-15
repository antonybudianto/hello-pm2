process.on("SIGTERM", () => {
  process.exit(0);
});

process.on("SIGINT", () => {
  process.send({
    type: "process:childint",
    data: {
      code: 0,
    },
  });
  process.exit(0);
});

async function prepareNewRelic() {
  // console.log("prepareNR");
}

(async () => {
  await prepareNewRelic();

  require("./app");
})();
