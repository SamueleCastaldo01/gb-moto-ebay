// ModelloInput.js
import React, { useState } from "react";
import { TextField, Button, Autocomplete } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase-config"; // Importa 'db' dalla tua configurazione Firebase

function AnnoDiProduzioneI({ modelli, setModelli }) {
  const [annoDiProduzione, setAnnoDiProduzione] = useState("");
  const [valoreSelezionato, setValoreSelezionato] = useState(""); // Per tenere traccia del valore selezionato

  const handleInputChange = (event, newInputValue) => {
    setAnnoDiProduzione(newInputValue.trim() ? newInputValue.toUpperCase() : "");
  };

  const isValidInput = () => {
    const annoDiProduzioneUpperCase = annoDiProduzione.trim().toUpperCase();
    return annoDiProduzioneUpperCase !== "" && !modelli.includes(annoDiProduzioneUpperCase);
  };


  //--------------------------------------------------------------------------------
  const handleAddModello = async () => {
    const annoDiProduzioneUpperCase = annoDiProduzione.trim().toUpperCase();

    if (annoDiProduzioneUpperCase !== "" && !modelli.includes(annoDiProduzioneUpperCase)) {
      try {
        const docRef = await addDoc(collection(db, "annoDiProduzioneTab"), {
          annoDiProduzione: annoDiProduzioneUpperCase,
        });
        console.log("Modello aggiunto con ID: ", docRef.id);

        setModelli((prev) => {
          const updatedModelli = [...prev, annoDiProduzioneUpperCase].sort((a, b) =>
            a.localeCompare(b)
          );
          return updatedModelli;
        });
        setAnnoDiProduzione(""); // Pulisci il campo di input
        setValoreSelezionato(""); // Pulisci il valore selezionato
      } catch (e) {
        console.error("Errore durante l'aggiunta del modello: ", e);
      }
    } else {
      console.log("Nome modello vuoto, contiene solo spazi o già esistente.");
    }
  };

  return (
    <div className="d-flex" style={{ alignItems: "center" }}>
      {/* Autocomplete */}
      <Autocomplete
        freeSolo
        options={modelli} // Passiamo i modelli come opzioni
        value={valoreSelezionato}
        onChange={(event, newValue) => setValoreSelezionato(newValue ? newValue.toUpperCase() : "")} // Aggiorna il valore selezionato in maiuscolo
        inputValue={annoDiProduzione}
        onInputChange={handleInputChange} // Aggiorna l'input mentre si digita e converte in maiuscolo
        renderInput={(params) => (
          <TextField
            {...params}
            label="Anno di Produzione"
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
      {annoDiProduzione.trim() !== "" && isValidInput() && (
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
      {modelli.includes(annoDiProduzione.trim().toUpperCase()) && (
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
  );
}

export default AnnoDiProduzioneI;
