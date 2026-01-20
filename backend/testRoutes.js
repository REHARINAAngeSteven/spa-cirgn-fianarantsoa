/**
 * ===============================
 * TEST ROUTES API – ADMIN ONLY
 * ===============================
 *

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

/**
 * ===============================
 * UTILS
 * ===============================
 
const logOk = (msg) => console.log(`✅ ${msg}`);
const logErr = (msg, err) => {
  console.error(`❌ ${msg}`);
  if (err?.response) {
    console.error('Status:', err.response.status);
    console.error('Data:', err.response.data);
  } else {
    console.error(err.message);
  }
};

/**
 * ===============================
 * AUTH
 * ===============================
 
async function loginAdmin() {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      login: 'admin',
      motDePasse: 'admin123',
    });

    const token = res.data.accessToken;

    if (!token) throw new Error('AccessToken non retourné par /auth/login');

    logOk('Login ADMIN réussi');
    return token;
  } catch (err) {
    logErr('Login ADMIN échoué', err);
    throw err;
  }
}

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

/**
 * ===============================
 * TESTS ADMIN
 * ===============================
 
async function testAdmin(token) {
  console.log('\n🔐 TESTS ADMIN\n');

  // 🔹 Référentiels
  await axios.get(`${BASE_URL}/referentiels/unites`, authHeader(token))
    .then(() => logOk('GET /referentiels/unites'))
    .catch(e => logErr('référentiels unites', e));

  await axios.get(`${BASE_URL}/referentiels/fonctions`, authHeader(token))
    .then(() => logOk('GET /referentiels/fonctions'))
    .catch(e => logErr('référentiels fonctions', e));

  await axios.get(`${BASE_URL}/referentiels/motifs`, authHeader(token))
    .then(() => logOk('GET /referentiels/motifs'))
    .catch(e => logErr('référentiels motifs', e));

  // 🔹 Militaires
  await axios.get(`${BASE_URL}/militaires`, authHeader(token))
    .then(res => {
      console.log('Militaires reçus:', res.data);
      logOk(`GET /militaires`);
    })
    .catch(e => logErr('militaires', e)); 

  // 🔹 Passations
  await axios.get(`${BASE_URL}/passations`, authHeader(token))
    .then(res => {
      console.log('Passations reçues:', res.data);
      logOk(`GET /passations`);
    })
    .catch(e => logErr('passations', e));

  // 🔹 Situations
  await axios.get(`${BASE_URL}/situations`, authHeader(token))
    .then(res => {
      logOk(`GET /situations → ${res.data.length} items`);
    })
    .catch(e => logErr('situations', e));
}

/**
 * ===============================
 * MAIN
 * ===============================
 
(async () => {
  try {
    console.log('\n🚀 LANCEMENT DES TESTS ADMIN\n');

    const adminToken = await loginAdmin();
    await testAdmin(adminToken);

    console.log('\n🎉 TOUS LES TESTS ADMIN TERMINÉS SANS 401/403\n');
  } catch (err) {
    logErr('Erreur globale', err);
  }
})();

*/

/**
 * ==========================================
 * TEST ROUTES API – CHARGE_SPA ONLY
 * ==========================================
 */

const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

/**
 * ==========================================
 * UTILS
 * ==========================================
 */
const logOk = (msg) => console.log(`✅ ${msg}`);
const logErr = (msg, err) => {
  console.error(`❌ ${msg}`);
  if (err?.response) {
    console.error("Status:", err.response.status);
    console.error("Data:", err.response.data);
  } else {
    console.error(err.message);
  }
};

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

/**
 * ==========================================
 * AUTH – CHARGE SPA
 * ==========================================
 */
async function loginChargeSpa() {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      login: "charge",
      motDePasse: "charge123",
    });

    const token = res.data.accessToken;
    if (!token) throw new Error("AccessToken non retourné");

    logOk("Login CHARGE_SPA réussi");
    return token;
  } catch (err) {
    logErr("Login CHARGE_SPA échoué", err);
    throw err;
  }
}

/**
 * ==========================================
 * TESTS CHARGE SPA
 * ==========================================
 */
async function testChargeSpa(token) {
  console.log("\n🔐 TESTS CHARGE_SPA\n");

  /**
   * ===============================
   * MOTIFS (par type uniquement)
   * ⚠️ FIX: Route correcte = /referentiels/motifs/type/:type
   * ===============================
   */
  await axios
    .get(`${BASE_URL}/referentiels/motifs/type/absent`, authHeader(token))
    .then((res) => {
      logOk(`GET /referentiels/motifs/type/absent → ${res.data.length} motifs`);
    })
    .catch((e) => logErr("motifs Absent", e));

  await axios
    .get(`${BASE_URL}/referentiels/motifs/type/indisponible`, authHeader(token))
    .then((res) => {
      logOk(`GET /referentiels/motifs/type/indisponible → ${res.data.length} motifs`);
    })
    .catch((e) => logErr("motifs Indisponible", e));

  /**
   * ===============================
   * MILITAIRES (unité du CHARGE_SPA)
   * ⚠️ FIX: Route correcte = GET /militaires (pas /militaires/unite)
   * Le filtrage par unité se fait automatiquement côté backend
   * ===============================
   */
  await axios
    .get(`${BASE_URL}/militaires`, authHeader(token))
    .then((res) => {
      logOk(`GET /militaires → ${res.data.data.length} militaires`);
    })
    .catch((e) => logErr("militaires", e));

  /**
   * ===============================
   * SITUATIONS SPA (unité seulement)
   * ⚠️ FIX: Paramètre 'date' requis
   * ===============================
   */
  const dateTest = "2026-01-15";
  await axios
    .get(`${BASE_URL}/situations`, {
      ...authHeader(token),
      params: { date: dateTest }
    })
    .then((res) => {
      logOk(`GET /situations?date=${dateTest} → ${res.data.data.length} situations`);
    })
    .catch((e) => logErr("situations", e));

  /**
   * ===============================
   * CREATE SITUATION (autorisé)
   * ⚠️ FIX: Structure de payload correcte selon le service
   * ===============================
   */
  await axios
    .post(
      `${BASE_URL}/situations`,
      {
        idMilitaire: 1, // ⚠️ camelCase selon le service
        motifId: 1,     // ⚠️ camelCase
        date_situation: "2026-01-15", // ⚠️ nom correct
        commentaire: "Test création situation CHARGE_SPA",
        est_previsionnel: false
      },
      authHeader(token)
    )
    .then(() => logOk("POST /situations"))
    .catch((e) => logErr("create situation", e));

  /**
   * ===============================
   * TEST INTERDIT (ADMIN ONLY)
   * Tester la création d'unité (réservée à ADMIN)
   * ===============================
   */
  await axios
    .post(`${BASE_URL}/referentiels/unites`, { nom_unite: "Test Unité" }, authHeader(token))
    .then(() =>
      logErr(
        "ERREUR SÉCURITÉ",
        new Error("CHARGE_SPA ne devrait PAS pouvoir créer des unités")
      )
    )
    .catch((e) => {
      if (e.response?.status === 403) {
        logOk("Création d'unité refusée correctement (403)");
      } else {
        logErr("Test sécurité création unité", e);
      }
    });
}

/**
 * ==========================================
 * MAIN
 * ==========================================
 */
(async () => {
  try {
    console.log("\n🚀 LANCEMENT DES TESTS CHARGE_SPA\n");

    const token = await loginChargeSpa();
    await testChargeSpa(token);

    console.log("\n🎉 TOUS LES TESTS CHARGE_SPA TERMINÉS\n");
  } catch (err) {
    logErr("Erreur globale", err);
  }
})();