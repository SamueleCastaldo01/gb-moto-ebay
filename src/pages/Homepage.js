// Homepage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase-config"; // Importa 'db' dalla tua configurazione Firebase
import NomeModelloI from "../components/NomeModelloI";
import AnnoDiProduzioneI from "../components/AnnoDiProduzioneI";
import PezzoDiRicambioI from "../components/PezzoDiRicambio";
import { InsPezzoDiRicambio } from "../components/InsPezzoRicambio";
import { EditPezzoDiRicambio } from "../components/EditPezzoDiRicambio";

function Homepage() {
  localStorage.setItem("naviBottom", 0);

  let navigate = useNavigate();
  const [modelli, setModelli] = useState([]); // Stato per i modelli esistenti
  const [pezziDiRicambio, setPezziDiRicambio] = useState([]);
  const [annoProduzione, setAnnoDiProduzione] = useState([]); //array con anno di produzione del modello
  const [idModello, setIdModello] = useState("");
  const [nomeModello, setNomeModello] = useState("");
  const [nomePezzoRicambioSel, setNomePezzoRicambioSel] = useState("");
  const [showAnnoProd, setShowAnnoProd] = useState(false);
  const [showPezzoRic, setShowPezzoRic] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalShowEdit, setModalShowEdit] = useState(false);

  // Funzione per recuperare tutti i modelli dal database Firestore e ordinarli
  //------------------------------------------------------------------
  const fetchModelli = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "nomeModelloTab"));
      const modelliList = querySnapshot.docs.map((doc) =>
        doc.data().nomeModello.toUpperCase()
      );
      // Ordina i modelli in ordine alfabetico
      const sortedModelli = modelliList.sort((a, b) => a.localeCompare(b));
      setModelli(sortedModelli); // Popola lo stato solo con i nomi dei modelli
    } catch (error) {
      console.error("Errore nel recupero dei modelli: ", error);
    }
  };

  //------------------------------------------------------------------
  const fetchAnnoProduzione = async () => {
    try {
      // Crea una query per filtrare per nomeModello
      const q = query(
        collection(db, "annoDiProduzioneTab"),
        where("nomeModello", "==", nomeModello) // Filtra per nomeModello
      );

      // Esegui la query
      const querySnapshot = await getDocs(q);

      const modelliList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return data.annoDiProduzione ? data.annoDiProduzione.toUpperCase() : ""; // Assicura che annoDiProduzione sia presente
      });

      // Ordina i modelli in ordine alfabetico
      const sortedAnnoDiProduzione = modelliList.sort((a, b) =>
        a.localeCompare(b)
      );

      setAnnoDiProduzione(sortedAnnoDiProduzione); // Popola lo stato con i modelli ordinati
    } catch (error) {
      console.error("Errore nel recupero dei modelli: ", error);
    }
  };

    //------------------------------------------------------------------
    const fetchPezzoDiRicambio = async () => {
      try {
        // Crea una query per filtrare per nomeModello
        const q = query(
          collection(db, "pezzoDiRicambioTab")
        );
  
        // Esegui la query
        const querySnapshot = await getDocs(q);
  
        const modelliList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return data.nomePezzoDiRicambio ? data.nomePezzoDiRicambio.toUpperCase() : ""; // Assicura che annoDiProduzione sia presente
        });
  
        // Ordina i modelli in ordine alfabetico
        const sorteNomePezzoRic = modelliList.sort((a, b) =>
          a.localeCompare(b)
        );
  
        setPezziDiRicambio(sorteNomePezzoRic); // Popola lo stato con i modelli ordinati
      } catch (error) {
        console.error("Errore nel recupero dei modelli: ", error);
      }
    };
  //------------------------------------------------------------------
  useEffect(() => {
    fetchModelli();
  }, []);

  useEffect(() => {
    fetchAnnoProduzione();
  }, [nomeModello]);

  useEffect(() => {
    fetchPezzoDiRicambio();
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
            setNomeModello1={setNomeModello}
            setIdModello1={setIdModello}
            setShowAnnoProd={setShowAnnoProd}
            setShowPezzoRic={setShowPezzoRic}
          />

          {showAnnoProd && (
            <div className="mt-5">
              <AnnoDiProduzioneI
                annoProduzione={annoProduzione}
                nomeModello={nomeModello}
                idModello={idModello}
                fetchAnnoProduzione={fetchAnnoProduzione}
                setAnnoDiProduzione={setAnnoDiProduzione}
                setShowPezzoRic={setShowPezzoRic}
              />
            </div>
          )}

          {showPezzoRic && (
            <div className="mt-5">
              <PezzoDiRicambioI
                pezziDiRicambio={pezziDiRicambio}
                setModalShow={setModalShow}
                setModalShowEdit={setModalShowEdit}
              />
            </div>
          )}

          <InsPezzoDiRicambio
            show={modalShow}
            fetchPezzoDiRicambio={fetchPezzoDiRicambio}
            onHide={() => setModalShow(false)}
          />

          <EditPezzoDiRicambio
          pezzo={nomePezzoRicambioSel}
          show={modalShowEdit}
          onHide={() => setModalShowEdit(false)}
          />

        </div>
      </motion.div>
    </>
  );
}

export default Homepage;
