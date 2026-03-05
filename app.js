<script type="module">

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

/* CONFIG FIREBASE (troque depois se quiser criar o seu) */
const firebaseConfig = {
  apiKey: "echostream",
  authDomain: "echostream.firebaseapp.com",
  databaseURL: "https://echostream-default-rtdb.firebaseio.com",
  projectId: "echostream",
  storageBucket: "echostream.appspot.com",
  messagingSenderId: "000000000",
  appId: "1:000000:web:echostream"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


/* GERADOR DE ID CLOUD */

let cloudId = localStorage.getItem("echo_cloud_id");

if(!cloudId){
    cloudId = crypto.randomUUID();
    localStorage.setItem("echo_cloud_id", cloudId);
}

document.getElementById("cloud-id").textContent = "Sessão: " + cloudId;


/* BIBLIOTECA LOCAL */

let library = [];


/* SALVAR NA NUVEM */

function saveCloud(){

    const data = {
        library: library,
        lastUpdate: Date.now()
    };

    set(ref(db, "users/" + cloudId), data);

}


/* CARREGAR DA NUVEM */

async function loadCloud(){

    const snapshot = await get(ref(db, "users/" + cloudId));

    if(snapshot.exists()){

        const data = snapshot.val();

        if(data.library){
            library = data.library;
        }

        renderLibrary();

    }

}


/* RENDERIZAR MUSICAS */

function renderLibrary(){

    const grid = document.getElementById("library-grid");

    grid.innerHTML = "";

    library.forEach((music, index)=>{

        const item = document.createElement("div");

        item.className = "glass p-4 rounded-2xl cursor-pointer";

        item.innerHTML = `
        <img src="${music.cover}" class="w-full rounded-xl mb-3">
        <p class="font-bold text-sm">${music.title}</p>
        <p class="text-xs text-zinc-500">${music.artist}</p>
        `;

        item.onclick = () => playMusic(index);

        grid.appendChild(item);

    });

}


/* TOCAR MUSICA */

const audio = document.getElementById("audio-engine");

function playMusic(index){

    const music = library[index];

    audio.src = music.url;
    audio.play();

}


/* ADICIONAR MUSICA */

window.addMusic = function(title, artist, url, cover){

    library.push({
        title,
        artist,
        url,
        cover
    });

    renderLibrary();
    saveCloud();

};


/* INICIAR CLOUD */

loadCloud();

</script>
