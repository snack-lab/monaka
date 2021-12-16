(async () => {
  // Storage API support
  if (!navigator.storage) return;
  const storage = await navigator.storage.estimate();
  console.log(`permitted: ${ storage.quota / 1024 } Kb`);
  console.log(`used     : ${ storage.usage / 1024 } Kb`);
  console.log(`% used   : ${ Math.round((storage.usage / storage.quota) * 100) }%`);
  console.log(`remaining: ${ Math.floor((storage.quota - storage.usage) / 1024) } Kb`);
})();

// https://developer.mozilla.org/ja/docs/Web/API/Web_Storage_API