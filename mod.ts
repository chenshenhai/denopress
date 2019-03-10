const run = Deno.run;

const portalServer = run({
  args: ["deno", "--allow-net", "./server/portal/mod.ts", ".", "--cors"]
});

const dashboardServer = run({
  args: ["deno", "--allow-net", "./server/dashboard/mod.ts", ".", "--cors"]
});
