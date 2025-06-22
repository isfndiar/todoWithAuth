import mongoose from "mongoose";
import readline from "readline";
import { performance } from "perf_hooks";

// Fungsi util: tanya konfirmasi di terminal
const ask = (question) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });

// 1. Koneksi MongoDB
await mongoose.connect("mongodb://localhost:27017/benchmark_db");

// 2. Schema dan Model
const userSchema = new mongoose.Schema({
  email: String,
  username: String,
});
const UserModel = mongoose.model("User", userSchema);

// 3. Tambahkan data dummy kalau belum ada
const total = await UserModel.estimatedDocumentCount();
if (total < 1_000_000) {
  console.log("Seeding data dummy (1 juta user)...");
  const bulk = [];
  for (let i = 0; i < 1_000_000; i++) {
    bulk.push({ email: `user${i}@example.com`, username: `user${i}` });
  }
  await UserModel.insertMany(bulk);
  console.log("Seeding selesai.\n");
} else {
  console.log(`Data sudah ada (${total} user).\n`);
}

// 4. Query untuk benchmark
const query = { email: "user999999@example.com" };

// 5. Benchmark findOne()
const t1 = performance.now();
const resultFindOne = await UserModel.findOne(query);
const t2 = performance.now();
console.log("findOne() result:", resultFindOne ? "FOUND" : "NOT FOUND");
console.log("findOne() time:", (t2 - t1).toFixed(3), "ms");

// 6. Benchmark exists()
const t3 = performance.now();
const resultExists = await UserModel.exists(query);
const t4 = performance.now();
console.log("exists() result:", resultExists ? "FOUND" : "NOT FOUND");
console.log("exists() time:", (t4 - t3).toFixed(3), "ms");

// 7. Konfirmasi penghapusan data
const confirm = await ask("\nIngin hapus data benchmark? (y/n): ");
if (confirm === "y") {
  await UserModel.collection.drop();
  console.log("✅ Data berhasil dihapus (collection dropped).");
} else {
  console.log("❌ Data tidak dihapus.");
}

await mongoose.disconnect();
