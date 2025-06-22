Iya, betul banget! Banyak yang awalnya kira `readline` cuma bisa digunakan dalam mode callback langsung (alias "di dalam" blok), tapi ternyata kamu bisa **bungkus `rl.question` ke dalam `Promise`** agar bisa dipakai dengan `async/await`.

---

### 🔍 Penjelasan Singkat

Node.js `readline` secara default menggunakan **callback**, seperti ini:

```js
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Siapa nama kamu? ", (answer) => {
  console.log("Hai,", answer);
  rl.close();
});
```

Tapi dengan Promise, kamu bisa tulis kode yang **lebih rapi dan terstruktur**, misalnya:

```js
const ask = (q) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(q, (ans) => {
      rl.close();
      resolve(ans);
    });
  });

const main = async () => {
  const name = await ask("Siapa nama kamu? ");
  console.log("Halo,", name);
};

main();
```

---

### ✅ Keuntungannya:

- Lebih mudah dibaca
- Bisa digunakan di flow `async/await` bersama kode lain
- Lebih fleksibel untuk input berurutan

---

Mau saya bantu buat contoh CLI interaktif mini pakai `readline + async/await`? Misalnya: kuis, todo-list CLI, dsb?
