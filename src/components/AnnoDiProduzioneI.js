// ModelloInput.js
import React, { useState } from "react";
import { TextField, Button, Autocomplete } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase-config"; // Importa 'db' dalla tua configurazione Firebase

function AnnoDiProduzioneI({ annoProduzione, setShowPezzoRic, setAnnoDiProduzione1, nomeModello, idModello, fetchAnnoProduzione, setAnnoDiProduzioneSel }) {
  const [annoDiProduzione, setAnnoDiProduzione] = useState("");
  const [valoreSelezionato, setValoreSelezionato] = useState(""); // Per tenere traccia del valore selezionato

  const handleInputChange = (event, newInputValue) => {
    setAnnoDiProduzione(newInputValue.trim() ? newInputValue.toUpperCase() : "");
  };

  const isValidInput = () => {
    const annoDiProduzioneUpperCase = annoDiProduzione.trim().toUpperCase();
    return annoDiProduzioneUpperCase !== "" && !annoProduzione.includes(annoDiProduzioneUpperCase);
  };


  //--------------------------------------------------------------------------------
  const handleAddAnnoProd = async () => {
    const annoDiProduzioneUpperCase = annoDiProduzione.trim().toUpperCase();

    if (annoDiProduzioneUpperCase !== "" && !annoProduzione.includes(annoDiProduzioneUpperCase)) {
      try {
        const docRef = await addDoc(collection(db, "annoDiProduzioneTab"), {
          annoDiProduzione: annoDiProduzioneUpperCase,
          nomeModello: nomeModello,
          idModello: idModello,
        });
        console.log("Modello aggiunto con ID: ", docRef.id);

        fetchAnnoProduzione();
      } catch (e) {
        console.error("Errore durante l'aggiunta del modello: ", e);
      }
    } else {
      console.log("Nome modello vuoto, contiene solo spazi o già esistente.");
    }
  };

  return (
    <>
    <div className="d-flex" style={{ alignItems: "center" }}>
      {/* Autocomplete */}
      <Autocomplete
        freeSolo
        options={annoProduzione} // Passiamo i modelli come opzioni
        value={valoreSelezionato}
        onChange={(event, newValue) => {setValoreSelezionato(newValue ? newValue.toUpperCase() : ""); setShowPezzoRic(false);
            setAnnoDiProduzioneSel(newValue ? newValue.toUpperCase() : "")
        } } // Aggiorna il valore selezionato in maiuscolo
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
          onClick={handleAddAnnoProd}
        >
          Aggiungi
        </Button>
      )}

      {/* Pulsante Conferma */}
      {annoProduzione.includes(annoDiProduzione.trim().toUpperCase()) && (
        <Button
          variant="contained"
          color="success"
          style={{ marginLeft: "20px" }} // Margine sinistro per spazio tra Autocomplete e pulsante
          onClick={() => {setShowPezzoRic(true)}}
        >
          Conferma
        </Button>
      )}
    </div>
    </>
  );
}

export default AnnoDiProduzioneI;
