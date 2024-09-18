import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { TextField, Button, Autocomplete } from '@mui/material';
import { motion } from 'framer-motion';
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from '../firebase-config';  // Importa 'db' dalla tua configurazione Firebase

function Homepage() {
  localStorage.setItem("naviBottom", 0);

  let navigate = useNavigate();
  const [nomeModello, setNomeModello] = useState("");
  const [modelli, setModelli] = useState([]); // Stato per i modelli esistenti
  const [valoreSelezionato, setValoreSelezionato] = useState(""); // Per tenere traccia del valore selezionato

  // Funzione per recuperare tutti i modelli dal database Firestore e ordinarli
  useEffect(() => {
    const fetchModelli = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "nomeModelloTab"));
        const modelliList = querySnapshot.docs.map(doc => doc.data().nomeModello);
        // Ordina i modelli in ordine alfabetico
        const sortedModelli = modelliList.sort((a, b) => a.localeCompare(b));
        setModelli(sortedModelli); // Popola lo stato con i modelli ordinati
      } catch (error) {
        console.error("Errore nel recupero dei modelli: ", error);
      }
    };

    fetchModelli();
  }, []);

  // Funzione per aggiungere un nuovo modello nel database e aggiornare l'array
  const handleAddModello = async () => {
    if (nomeModello.trim() !== "" && !modelli.includes(nomeModello)) {
      try {
        const docRef = await addDoc(collection(db, "nomeModelloTab"), {
          nomeModello: nomeModello
        });
        console.log("Modello aggiunto con ID: ", docRef.id);

        // Aggiungi il modello appena salvato alla lista locale e ordina
        setModelli(prev => {
          const updatedModelli = [...prev, nomeModello].sort((a, b) => a.localeCompare(b));
          return updatedModelli;
        });
        setNomeModello(""); 
        setValoreSelezionato(""); 
      } catch (e) {
        console.error("Errore durante l'aggiunta del modello: ", e);
      }
    } else {
      console.log("Nome modello vuoto o già esistente.");
    }
  };

  return (
    <>
      {/**************NAVBAR MOBILE*************************************** */}
      <div className='navMobile row'>
        <div className='col-2'>
        </div>
        <div className='col' style={{ padding: 0 }}>
          <p className='navText'> GB Motoricambi Ebay </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}>
        <div className='container' style={{ textAlign: "center", marginTop: "160px" }}>

          {/* Autocomplete */}
          <Autocomplete
            freeSolo
            options={modelli} // Passiamo i modelli come opzioni
            value={valoreSelezionato}
            onChange={(event, newValue) => setValoreSelezionato(newValue)} // Aggiorna il valore selezionato
            inputValue={nomeModello}
            onInputChange={(event, newInputValue) => setNomeModello(newInputValue)} // Aggiorna l'input mentre si digita
            renderInput={(params) => <TextField {...params} label="Nome Modello" variant="outlined" />}
          />

          {/* Pulsante Aggiungi che appare solo se il modello non è nella lista */}
          {nomeModello && !modelli.includes(nomeModello) && (
            <Button variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={handleAddModello}>
              Aggiungi "{nomeModello}"
            </Button>
          )}

        </div>
      </motion.div>
    </>
  );
}

export default Homepage;
