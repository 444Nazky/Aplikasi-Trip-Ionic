/**
 * Cloud Functions for Endpoint Trip API
 * Deploy with: firebase deploy --only functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

// ============================================
// TRIPS API
// ============================================

/**
 * GET /trips - List all trips
 */
exports.apiTrips = functions.https.onRequest(async (req, res) => {
  // CORS headers
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  try {
    if (req.method !== "GET" && req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const tripsRef = db.collection("trips");

    if (req.method === "GET") {
      const snapshot = await tripsRef.orderBy("createdAt", "desc").get();
      const trips = [];
      snapshot.forEach(doc => {
        trips.push({ id: doc.id, ...doc.data() });
      });
      return res.status(200).json({ success: true, data: trips });
    }

    if (req.method === "POST") {
      const { name, destination, startDate, endDate, description } = req.body;

      if (!name || !destination) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: name, destination"
        });
      }

      const tripData = {
        name,
        destination,
        startDate: startDate || null,
        endDate: endDate || null,
        description: description || "",
        status: "planned",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const docRef = await tripsRef.add(tripData);
      return res.status(201).json({
        success: true,
        data: { id: docRef.id, ...tripData },
        message: "Trip created successfully"
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /trips/:id - Get single trip
 * DELETE /trips/:id - Delete trip
 * PUT /trips/:id - Update trip
 */
exports.apiTripById = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  try {
    const tripId = req.query.id || req.path.split("/").pop();

    if (!tripId) {
      return res.status(400).json({ success: false, error: "Trip ID required" });
    }

    const tripRef = db.collection("trips").doc(tripId);
    const trip = await tripRef.get();

    if (!trip.exists) {
      return res.status(404).json({ success: false, error: "Trip not found" });
    }

    // GET
    if (req.method === "GET") {
      return res.status(200).json({ success: true, data: { id: trip.id, ...trip.data() } });
    }

    // DELETE
    if (req.method === "DELETE") {
      await tripRef.delete();
      return res.status(200).json({ success: true, message: "Trip deleted" });
    }

    // PUT
    if (req.method === "PUT") {
      const { name, destination, startDate, endDate, description, status } = req.body;
      const updateData = {
        ...(name && { name }),
        ...(destination && { destination }),
        ...(startDate !== undefined && { startDate }),
        ...(endDate !== undefined && { endDate }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await tripRef.update(updateData);
      const updated = await tripRef.get();
      return res.status(200).json({ success: true, data: { id: updated.id, ...updated.data() } });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// HEALTH CHECK
// ============================================

/**
 * GET /api/health - Health check endpoint
 */
exports.apiHealth = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  return res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "endpoint-trip"
  });
});
});

// ============================================
// API INFO
// ============================================

/**
 * GET /api - API documentation
 */
exports.apiInfo = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  const routes = {
    description: "Endpoint Trip API",
    version: "1.0.0",
    endpoints: {
      health: { method: "GET", path: "/api/health", description: "Health check" },
      trips: { method: "GET/POST", path: "/api/trips", description: "List or create trips" },
      trip: { method: "GET/PUT/DELETE", path: "/api/trips/:id", description: "Get, update, or delete a trip" }
    },
    example: {
      createTrip: {
        method: "POST",
        path: "/api/trips",
        body: { name: "Beach Vacation", destination: "Bali", startDate: "2024-06-01", endDate: "2024-06-10" }
      }
    }
  };

  return res.status(200).json(routes);
});
});
