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
import { TitoloInserzioneEbay } from "../components/TitoloInserzioneEbay";
import { InserzioneTitoloSubito } from "../components/InserzioneTitoloSubito";
import { DettagliPezzoDiRicambio } from "../components/DettagliPezzoDiRicambio";

function Homepage() {
  localStorage.setItem("naviBottom", 0);

  let navigate = useNavigate();
  const [modelli, setModelli] = useState([]); // Stato per i modelli esistenti
  const [pezziDiRicambio, setPezziDiRicambio] = useState([]);
  const [annoProduzione, setAnnoDiProduzione] = useState([]); //array con anno di produzione del modello
  const [idModello, setIdModello] = useState("");
  const [nomeModello, setNomeModello] = useState("");
  const [annoDiProduzioneSel, setAnnoDiProduzioneSel] = useState("");
  const [nomePezzoRicambioSel, setNomePezzoRicambioSel] = useState("");
  const [statoSel, setStatoSel] = useState("");
  const [updateState, setUpdateState] = useState(0);
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
  const fetchPezziDiRicambio = async () => {
    try {
      // Crea una query per filtrare per nomeModello
      const q = query(collection(db, "pezzoDiRicambioTab"));

      // Esegui la query
      const querySnapshot = await getDocs(q);

      const modelliList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return data.nomePezzoDiRicambio
          ? data.nomePezzoDiRicambio.toUpperCase()
          : ""; // Assicura che annoDiProduzione sia presente
      });

      // Ordina i modelli in ordine alfabetico
      const sorteNomePezzoRic = modelliList.sort((a, b) => a.localeCompare(b));

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
    fetchPezziDiRicambio();
  }, []);

  return (
    <>
      {/**************NAVBAR MOBILE*************************************** */}
      <div className="navMobile row" style={{zIndex: "99"}}>
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
          style={{ textAlign: "center", marginTop: "90px", marginBottom: "200px" }}
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
                setAnnoDiProduzioneSel={setAnnoDiProduzioneSel}
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
                nomePezzoDiRicambioSel={nomePezzoRicambioSel}
                setNomePezzoRicambioSel={setNomePezzoRicambioSel}
                setStatoSel={setStatoSel}
                updateState={updateState}
                statoSel={statoSel}
              />
            </div>
          )}

          {modalShow && (
            <InsPezzoDiRicambio
              show={modalShow}
              fetchPezziDiRicambio={fetchPezziDiRicambio}
              setNomePezzoRicambioSel={setNomePezzoRicambioSel}
              onHide={() => setModalShow(false)}
            />
          )}

          {modalShowEdit && (
            <EditPezzoDiRicambio
              pezzo={nomePezzoRicambioSel}
              setPezzo={setNomePezzoRicambioSel}
              show={modalShowEdit}
              updateState={updateState}
              setUpdateState={setUpdateState}
              fetchPezziDiRicambio={fetchPezziDiRicambio}
              onHide={() => setModalShowEdit(false)}
            />
          )}

          {/**OUTPUT++++++++++++++++++++++++++++++++++++++++++++ */}
          <TitoloInserzioneEbay
            nomePezzoRicambioSel={nomePezzoRicambioSel}
            nomeModello={nomeModello}
            annoProduzione={annoDiProduzioneSel}
            statoSel={statoSel}
          />

          <InserzioneTitoloSubito
            nomePezzoRicambioSel={nomePezzoRicambioSel}
            nomeModello={nomeModello}
            annoProduzione={annoDiProduzioneSel}
            statoSel={statoSel}
          />

          <DettagliPezzoDiRicambio
            nomePezzoDiRicambio={nomePezzoRicambioSel}
            statoSel={statoSel}
          />
        </div>
      </motion.div>
    </>
  );
}

export default Homepage;
