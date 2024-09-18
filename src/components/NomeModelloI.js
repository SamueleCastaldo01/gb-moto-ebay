// ModelloInput.js
import React, { useState } from "react";
import { TextField, Button, Autocomplete } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase-config"; // Importa 'db' dalla tua configurazione Firebase

function ModelloInput({
  modelli,
  setModelli,
  setShowAnnoProd,
  setNomeModello1,
  setIdModello1,
}) {
  const [nomeModello, setNomeModello] = useState("");
  const [idModello, setIdModello] = useState("");
  const [valoreSelezionato, setValoreSelezionato] = useState(""); // Per tenere traccia del valore selezionato

  const handleInputChange = (event, newInputValue) => {
    setNomeModello(newInputValue.trim() ? newInputValue.toUpperCase() : "");
  };

  const isValidInput = () => {
    const nomeModelloUpperCase = nomeModello.trim().toUpperCase();
    return (
      nomeModelloUpperCase !== "" && !modelli.includes(nomeModelloUpperCase)
    );
  };

  const handleAddModello = async () => {
    const nomeModelloUpperCase = nomeModello.trim().toUpperCase();

    if (
      nomeModelloUpperCase !== "" &&
      !modelli.includes(nomeModelloUpperCase)
    ) {
      try {
        const docRef = await addDoc(collection(db, "nomeModelloTab"), {
          nomeModello: nomeModelloUpperCase,
        });
        console.log("Modello aggiunto con ID: ", docRef.id);
        setIdModello(docRef.id);

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

  return (
    <div className="d-flex" style={{ alignItems: "center" }}>
      {/* Autocomplete */}
      <Autocomplete
        freeSolo
        options={modelli} // Passiamo i modelli come opzioni
        value={valoreSelezionato}
        onChange={(event, newValue) => {
          setValoreSelezionato(newValue ? newValue.toUpperCase() : "");
          setShowAnnoProd(false);
        }} // Aggiorna il valore selezionato in maiuscolo
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
          const filtered = options.filter((option) =>
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
          onClick={() => {
            setShowAnnoProd(true);
            setNomeModello1(nomeModello);
            setIdModello1(idModello);
          }}
        >
          Conferma
        </Button>
      )}
    </div>
  );
}

export default ModelloInput;
