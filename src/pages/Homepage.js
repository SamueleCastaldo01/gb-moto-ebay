// Homepage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config"; // Importa 'db' dalla tua configurazione Firebase
import NomeModelloI from "../components/NomeModelloI";
import AnnoDiProduzioneI from "../components/AnnoDiProduzioneI";

function Homepage() {
  localStorage.setItem("naviBottom", 0);

  let navigate = useNavigate();
  const [modelli, setModelli] = useState([]); // Stato per i modelli esistenti
  const [annoProduzione, setAnnoDiProduzione] = useState([]); //array con anno di produzione del modello
  const [showAnnoProd, setShowAnnoProd] = useState(false);

  // Funzione per recuperare tutti i modelli dal database Firestore e ordinarli

  const fetchModelli = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "nomeModelloTab"));
      const modelliList = querySnapshot.docs.map(
        (doc) => doc.data().nomeModello.toUpperCase() // Trasforma tutto in maiuscolo
      );
      // Ordina i modelli in ordine alfabetico
      const sortedModelli = modelliList.sort((a, b) => a.localeCompare(b));
      setModelli(sortedModelli); // Popola lo stato con i modelli ordinati
    } catch (error) {
      console.error("Errore nel recupero dei modelli: ", error);
    }
  };

  const fetchAnnoProduzione = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "annoDiProduzioneTab"));
      const modelliList = querySnapshot.docs.map(
        (doc) => doc.data().annoDiProduzione.toUpperCase() // Trasforma tutto in maiuscolo
      );
      // Ordina i modelli in ordine alfabetico
      const sortedAnnoDiProduzione = modelliList.sort((a, b) => a.localeCompare(b));
      setAnnoDiProduzione(sortedAnnoDiProduzione); // Popola lo stato con i modelli ordinati
    } catch (error) {
      console.error("Errore nel recupero dei modelli: ", error);
    }
  };

  useEffect(() => {
    fetchModelli();
    if(showAnnoProd) {
      fetchAnnoProduzione();
    }
  }, []);


  return (
    <>
      {/**************NAVBAR MOBILE*************************************** */}
      <div className="navMobile row">
        <div className="col-2"></div>
        <div className="col" style={{ padding: 0 }}>
          <p className="navText"> GB Motoricambi Ebay </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div
          className="container"
          style={{ textAlign: "center", marginTop: "160px" }}
        >
          <NomeModelloI
            modelli={modelli}
            setModelli={setModelli}
            setShowAnnoProd={setShowAnnoProd}
          />

          {showAnnoProd && (
            <div className="mt-5">
              <AnnoDiProduzioneI
                annoProduzione={annoProduzione}
                setAnnoDiProduzione={setAnnoDiProduzione}
                setShowAnnoProd={setShowAnnoProd}
              />
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

export default Homepage;
