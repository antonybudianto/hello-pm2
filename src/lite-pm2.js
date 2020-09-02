const pm2 = require("pm2");
const { execSync } = require("child_process");
const os = require("os");

const MEMORY_PERCENTAGE_LIMIT = 20;

function getMemoryLimit() {
  const totalCpus = os.cpus().length;
  const totalMemBytes = os.totalmem();
  const limitPerChildBytes = totalMemBytes / totalCpus;
  const limitLowMemBytes = (MEMORY_PERCENTAGE_LIMIT / 100) * limitPerChildBytes;
  const limitPerChildMb = Math.round(limitLowMemBytes / 1024 / 1024);
  return limitPerChildMb + "M";
}

const LIMIT = getMemoryLimit();

const service = process.argv[2];

pm2.connect(true, function (err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  pm2.list((err, list) => {
    if (list.length) {
      console.log("already exist");
      process.exit(0);
      return;
    }

    process.on("SIGUSR2", () => {
      console.log("Lite PM2 SIGUSR2 reloading...");
      pm2.reload("all", {}, () => {
        pm2.reset("all");
      });
    });

    process.on("SIGHUP", () => {
      console.log("Lite PM2 SIGHUP reloading...");
      pm2.reload("all", {}, () => {
        pm2.reset("all");
      });
    });

    process.on("SIGTERM", () => {
      console.log("Lite PM2 SigTerm");
      pm2.delete("all", () => {
        pm2.disconnect();
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      console.log("Lite PM2 SigInt");
      pm2.delete("all", () => {
        pm2.disconnect();
        process.exit(0);
      });
    });

    pm2.start(
      {
        script: "boot.js",
        name: service || "lite",
        exec_mode: "cluster",
        instances: 0,
        output: "NULL",
        error: "NULL",
        max_memory_restart: LIMIT,
      },
      function (err2, proc) {
        pm2.disconnect();

        pm2.launchBus((err, bus) => {
          bus.on("log:err", function (e) {
            console.log("err:", e.data);
          });
        });

        if (err2) {
          throw err2;
        }
      }
    );
  });
});

// process.stdin.resume();
