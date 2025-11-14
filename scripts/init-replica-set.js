// init-replica-set.js - Script d'initialisation du ReplicaSet rs0
// Vérifier si le ReplicaSet est déjà initialisé
try {
  var status_rs = rs.status();
  print("ReplicaSet déjà initialisé. Statut:");
  printjson(status_rs);
} catch (e) {
  // Si erreur, cela signifie qu'il faut initialiser
  print("Initialisation du ReplicaSet rs0...");

  rs.initiate({
    _id: "rs0",
    members: [
      { _id: 0, host: "127.0.0.1:27017", priority: 2 },
      { _id: 1, host: "127.0.0.1:27018", priority: 1 },
      { _id: 2, host: "127.0.0.1:27019", arbiterOnly: true }
    ]
  });

  // Attendre que le ReplicaSet soit initialisé
  sleep(3000);

  // Vérifier le statut
  print("=== ReplicaSet Status ===");
  printjson(rs.status());
}