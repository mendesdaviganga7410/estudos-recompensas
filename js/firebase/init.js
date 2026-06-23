/* ==========================================================================
   firebase/init.js — Inicialização do Firebase com importação dinâmica
   ========================================================================== */

const firebaseConfig = {
    apiKey:            "AIzaSyC14a7HFLN1fgM06lrVeODNpaAS6iqaLSE",
    authDomain:        "estudos-recompensas.firebaseapp.com",
    projectId:         "estudos-recompensas",
    storageBucket:     "estudos-recompensas.firebasestorage.app",
    messagingSenderId: "955588078794",
    appId:             "1:955588078794:web:1d868c8ce10c1350e01833"
};

let app, auth, db;

let signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged;
let createUserWithEmailAndPassword, signInWithEmailAndPassword;
let updateProfile, updateEmail, updatePassword;
let sendEmailVerification, sendPasswordResetEmail;

let doc, getDoc, setDoc, collection, query, where, getDocs;

try {
    const fa = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js");
    const fb = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
    const fs = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");

    app = fa.initializeApp(firebaseConfig);
    auth = fb.getAuth(app);
    db = fs.getFirestore(app);

    signInWithPopup             = fb.signInWithPopup;
    GoogleAuthProvider          = fb.GoogleAuthProvider;
    signOut                     = fb.signOut;
    onAuthStateChanged          = fb.onAuthStateChanged;
    createUserWithEmailAndPassword = fb.createUserWithEmailAndPassword;
    signInWithEmailAndPassword  = fb.signInWithEmailAndPassword;
    updateProfile               = fb.updateProfile;
    updateEmail                 = fb.updateEmail;
    updatePassword              = fb.updatePassword;
    sendEmailVerification       = fb.sendEmailVerification;
    sendPasswordResetEmail      = fb.sendPasswordResetEmail;

    doc        = fs.doc;
    getDoc     = fs.getDoc;
    setDoc     = fs.setDoc;
    collection = fs.collection;
    query      = fs.query;
    where      = fs.where;
    getDocs    = fs.getDocs;
} catch (_) {
    /* Firebase bloqueado ou indisponível — tudo permanece undefined */
}

export {
    app, auth, db,
    signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged,
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    updateProfile, updateEmail, updatePassword,
    sendEmailVerification, sendPasswordResetEmail,
    doc, getDoc, setDoc, collection, query, where, getDocs
};
