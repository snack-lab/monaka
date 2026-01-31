const version = 1;
const request = indexedDB.open("monaka", version);

request.onsuccess = (event) => {
  //
};

request.onerror = (event) => {
  console.error("IndexedDB error:", event.target.error);
};

request.onupgradeneeded = (event) => {
  // migration code
  // const db = event.target.result;
};

let idb = indexedDB;
if ("storageBuckets" in navigator) {
  // persisted ストレージバケットを永続化するかどうか
  // durability strict:停電時のデータ喪失のリスクを最小限に抑える、relaxed: 電源が失われたときに、忘れることがあるが、パフォーマンスが向上する
  const bucket = await navigator.storageBuckets.open("logs-bucket", {
    durability: "strict", // strict | relaxed
    persisted: true,
  });
  idb = bucket.indexedDB;
}
const bucketRequest = idb.open("log", version);

bucketRequest.onsuccess = (event) => {
  //
};
bucketRequest.onerror = (event) => {
  console.error("IndexedDB error:", event.target.error);
};
bucketRequest.onupgradeneeded = (event) => {
  // migration code
  // const db = event.target.result;
}
