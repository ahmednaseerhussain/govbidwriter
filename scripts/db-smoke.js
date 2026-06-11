// Quick DB smoke test: verifies the Neon connection, the free-tools write
// path, and that the email-system tables exist. Run: node scripts/db-smoke.js
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

(async () => {
  const t = await db.generatedTool.create({
    data: { toolType: "smoke_test", output: "ok" },
  });
  console.log("generatedTool write ok:", t.id);
  await db.generatedTool.delete({ where: { id: t.id } });

  const [sequences, notifications, emailLogs, prefs] = await Promise.all([
    db.emailSequence.count(),
    db.notification.count(),
    db.emailLog.count(),
    db.emailPreference.count(),
  ]);
  console.log(
    `email tables ok: sequences=${sequences} notifications=${notifications} emailLogs=${emailLogs} prefs=${prefs}`
  );
  await db.$disconnect();
})().catch((e) => {
  console.error("DB FAIL:", e.message);
  process.exit(1);
});
