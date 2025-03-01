const map = new Map();

map.set("a", 1);
map.set("b", 2);
map.set("c", 3);

console.debug("size = ", map.size);
console.debug("a = ", map.get("a"));
console.debug("has b =", map.has("b"));

console.log("update a");
map.set("a", 99);

console.log("delete b");
map.delete("b");
console.debug("has b =", map.has("b"));

console.log("clear");
map.clear();
console.debug("size = ", map.size);

// entries
map.set("a", 10);
map.set("b", 20);
map.set("c", 30);

for (const [key, value] of map.entries()) {
  console.log("entries", key, value);
}

// forEach
map.forEach((value, key) => {
  console.log("forEach", key, value);
});

// keys
for (const key of map.keys()) {
  console.log("keys", key);
}

// values
for (const value of map.values()) {
  console.log("values", value);
}

// clone
const clone = new Map(map);
console.log("clone", clone);
console.log("clone === map", clone === map);
