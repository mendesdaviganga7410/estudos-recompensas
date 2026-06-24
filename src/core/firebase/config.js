/* ==========================================================================
   firebase/config.js — Inicialização do Firebase
   ========================================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
    getFirestore,
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey:            "AIzaSyC14a7HFLN1fgM06lrVeODNpaAS6iqaLSE",
    authDomain:        "estudos-recompensas.firebaseapp.com",
    projectId:         "estudos-recompensas",
    storageBucket:     "estudos-recompensas.firebasestorage.app",
    messagingSenderId: "955588078794",
    appId:             "1:955588078794:web:1d868c8ce10c1350e01833"
};

export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});
