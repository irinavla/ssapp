import { initializeApp } from 'firebase/app';
import { 
    getFirestore,
    collection,
    getDocs,
    onSnapshot, // add a realtime listener for changes in the collection
    addDoc,
    doc,
    deleteDoc,
    where,
    query,
    orderBy,
    serverTimestamp, // creates a Firestore timestamp
    getDoc, // get a single doc
    updateDoc
 } from 'firebase/firestore';

 import { 
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut, 
    onAuthStateChanged // listen to auth changes
  } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyB0xBFhEy6qAevzfXmVMVOCXrhZ8TovsxA",
    authDomain: "ssapp-ed52c.firebaseapp.com",
    projectId: "ssapp-ed52c",
    storageBucket: "ssapp-ed52c.appspot.com",
    messagingSenderId: "26296363570",
    appId: "1:26296363570:web:4d70a795d768358509ea2b",
    measurementId: "G-C490D53N2Q"
  };

  // init Firebase app
  initializeApp(firebaseConfig);

  // init Firestore services on frontend
  const db = getFirestore();
  const auth = getAuth();

  // get reference to specific collection
  const colRef = collection(db, 'books');

  // queries
//   const q = query(colRef, where('author', '==', 'Stephen King'));
  const q = query(colRef, orderBy('createdAt'));

  // get realtime collection data
  const unsubCollection = onSnapshot(q, (snapshot) => {
    let books = [];
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id })
    });

    console.log(books);
  });

  // get collection data
//   getDocs(colRef)
//   .then((snapshot) => {
//     let books = [];
//     snapshot.docs.forEach((doc) => {
//         books.push({ ...doc.data(), id: doc.id })
//     });

//     console.log(books);
//   })
//   .catch((err) => console.log(err));

  // adding new books
  const addBookForm = document.querySelector('.add');

  addBookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    addDoc(colRef, { 
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp()
     }).then(() => {
         addBookForm.reset()
     })
  });

  // deleting a book
  const deleteBookForm = document.querySelector('.delete');

  deleteBookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const docRef = doc(db, 'books', deleteBookForm.id.value);

    deleteDoc(docRef).then(() => deleteBookForm.reset());
  });

  const docRef = doc(db, 'books', 'e3HNhnNEuftHMTWg6MAX');

//   getDoc(docRef).then((doc) => console.log(doc.data(), doc.id));

  const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id);
  });


  // updating a document
const updateForm = document.querySelector('.update')

updateForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const docRef = doc(db, 'books', updateForm.id.value);

    updateDoc(docRef, {
        title: 'updated title'
    }).then(() => updateForm.reset());
});

// signing users up
const signupForm = document.querySelector('.signup');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email =  signupForm.email.value;
    const password = signupForm.password.value;

    createUserWithEmailAndPassword(auth, email, password).then((credentials) => {
        console.log(credentials.user);
        signupForm.reset();
    }).catch((err) => console.log(err));
});

// login
const loginForm = document.querySelector('.login');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email =  loginForm.email.value;
    const password = loginForm.password.value;
    signInWithEmailAndPassword(auth, email, password).then((credentials) => {
        //console.log('user logged in: ', credentials.user);
        loginForm.reset();
    }).catch((err) => console.log(err));
});


// logout
const logoutBtn = document.querySelector('.logout');

logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => console.log('user signed out')).catch((err) => console.log(err.message));
});


// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user status changed >> ', user);
});

// unsubscribe to listeners
const unsubButton = document.querySelector('.unsub');

unsubButton.addEventListener('click', () => {
    console.log('unsubscribing');

    unsubCollection();
    unsubDoc();
    unsubAuth();
});
