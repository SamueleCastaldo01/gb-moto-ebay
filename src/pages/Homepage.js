import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Autocomplete } from "@mui/material";
import { motion } from "framer-motion";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase-config"; // Importa 'db' dalla tua configurazione Firebase

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

    fetchModelli();
  }, []);

  // Funzione per aggiungere un nuovo modello nel database e aggiornare l'array
  const handleAddModello = async () => {
    const nomeModelloUpperCase = nomeModello.trim().toUpperCase(); // Converti l'input in maiuscolo

    // Verifica se il nome del modello è una stringa vuota o contiene solo spazi
    if (nomeModelloUpperCase !== "" && !modelli.includes(nomeModelloUpperCase)) {
      try {
        const docRef = await addDoc(collection(db, "nomeModelloTab"), {
          nomeModello: nomeModelloUpperCase,
        });
        console.log("Modello aggiunto con ID: ", docRef.id);

        // Aggiungi il modello appena salvato alla lista locale e ordina
        setModelli((prev) => {
          const updatedModelli = [...prev, nomeModelloUpperCase].sort((a, b) =>
            a.localeCompare(b)
          );
          return updatedModelli;
        });
        setNomeModello(""); // Pulisci il campo di input
        setValoreSelezionato(""); // Pulisci il valore selezionato
      } catch (e) {
        console.error("Errore durante l'aggiunta del modello: ", e);
      }
    } else {
      console.log("Nome modello vuoto, contiene solo spazi o già esistente.");
    }
  };

  // Funzione per gestire la trasformazione in maiuscolo dell'input dell'utente
  const handleInputChange = (event, newInputValue) => {
    // Se la nuova stringa non è vuota, convertila in maiuscolo
    setNomeModello(newInputValue.trim() ? newInputValue.toUpperCase() : "");
  };

  // Funzione per controllare se il valore dell'input è valido
  const isValidInput = () => {
    const nomeModelloUpperCase = nomeModello.trim().toUpperCase();
    return nomeModelloUpperCase !== "" && !modelli.includes(nomeModelloUpperCase);
  };

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
          <div className="d-flex" style={{ alignItems: "center" }}>
            {/* Autocomplete */}
            <Autocomplete
              freeSolo
              options={modelli} // Passiamo i modelli come opzioni
              value={valoreSelezionato}
              onChange={(event, newValue) => setValoreSelezionato(newValue ? newValue.toUpperCase() : "")} // Aggiorna il valore selezionato in maiuscolo
              inputValue={nomeModello}
              onInputChange={handleInputChange} // Aggiorna l'input mentre si digita e converte in maiuscolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nome Modello"
                  variant="outlined"
                  style={{ width: "300px", textTransform: "uppercase" }} // Imposta il testo del TextField in maiuscolo
                />
              )}
              filterOptions={(options, params) => {
                const inputValueUpperCase = params.inputValue.trim().toUpperCase();
                const filtered = options.filter(option =>
                  option.toLowerCase().includes(inputValueUpperCase.toLowerCase())
                );
                if (inputValueUpperCase && !filtered.includes(inputValueUpperCase)) {
                  filtered.push(inputValueUpperCase);
                }
                return filtered;
              }}
            />

            {/* Pulsante Aggiungi */}
            {nomeModello.trim() !== "" && isValidInput() && (
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: "20px" }} // Margine sinistro per spazio tra Autocomplete e pulsante
                onClick={handleAddModello}
              >
                Aggiungi
              </Button>
            )}

            {/* Pulsante Conferma */}
            {modelli.includes(nomeModello.trim().toUpperCase()) && (
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: "20px" }} // Margine sinistro per spazio tra Autocomplete e pulsante
                onClick={handleAddModello}
              >
                Conferma
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Homepage;
