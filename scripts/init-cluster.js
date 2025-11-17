// init-cluster.js
// Script to add shards to the MongoDB cluster (idempotent)

print("=== Adding Shards to Cluster ===");

// Function to check if shard already exists
function shardExists(shardName) {
  var shards = db.getSiblingDB("admin").runCommand({ listShards: 1 });
  if (shards.ok === 1) {
    for (var i = 0; i < shards.shards.length; i++) {
      if (shards.shards[i]._id === shardName) {
        return true;
      }
    }
  }
  return false;
}
print("Lowering majority to enable shards...");
db.adminCommand({
  setDefaultRWConcern: 1,
  defaultWriteConcern: { w: 1 }
});

sleep(6000);  // PAUSE: attendre que la config soit appliquée

// Add Shard 1 (Paris primary, Lyon secondary)
if (!shardExists("shard1RS")) {
  print("Adding Shard 1 (Paris Data)...");
  sh.addShard("shard1RS/noscites-shard1-paris:27017,noscites-shard1-lyon:27017,noscites-shard1-arbiter:27017");
  print("Shard 1 added successfully.");
} else {
  print("Shard 1 already exists. Skipping.");
}

// Add Shard 2 (Lyon primary, Paris secondary)
if (!shardExists("shard2RS")) {
  print("Adding Shard 2 (Lyon Data)...");
  sh.addShard("shard2RS/noscites-shard2-lyon:27017,noscites-shard2-paris:27017,noscites-shard2-arbiter:27017");
  print("Shard 2 added successfully.");
} else {
  print("Shard 2 already exists. Skipping.");
}

// Display cluster status
print("");
print("=== Cluster Status ===");
sh.status();

print("");
print("=== Shards successfully configured ===");
print("Shard 1 (Paris): Primary in Paris, Secondary in Lyon");
print("Shard 2 (Lyon): Primary in Lyon, Secondary in Paris");
