// StatoRicambio.js
import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { db } from "../firebase-config"; // Importa la configurazione Firebase
import { query, collection, where, getDocs } from "firebase/firestore"; // Funzioni per leggere documenti

export function StatoRicambio({ nomePezzoDiRicambioSel, statoSel, setStatoSel, updateState }) {
  const [stati, setStati] = useState([]); // Stato per memorizzare gli stati
  const [loading, setLoading] = useState(true); // Stato per indicare il caricamento dei dati


 const fetchStati = async () => {
    if (!nomePezzoDiRicambioSel) return; // Non fare nulla se non è selezionato un pezzo di ricambio

    try {
      // Query per trovare il documento basato sul nome del pezzo di ricambio
      const pezzoQuery = query(
        collection(db, "pezzoDiRicambioTab"),
        where("nomePezzoDiRicambio", "==", nomePezzoDiRicambioSel)
      );
      const querySnapshot = await getDocs(pezzoQuery);

      if (!querySnapshot.empty) {
        // Supponiamo che il nome del pezzo sia unico e prendiamo il primo documento trovato
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        // Estrai e filtra gli stati unici
        setStati(data.descrizioni.map((d) => d.stato).filter((value, index, self) => self.indexOf(value) === index));
      } else {
        console.log("Documento non trovato.");
      }
    } catch (error) {
      console.error("Errore durante il recupero degli stati: ", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchStati();
  }, [nomePezzoDiRicambioSel, updateState]);

  return (
    <>
      {!loading && stati.length > 0 && (
        <Autocomplete
          disableCloseOnSelect
          options={stati} // Passiamo gli stati come opzioni
          value={statoSel}
          onChange={(event, newValue) => setStatoSel(newValue || "")} // Usa l'opzione selezionata
          inputValue={statoSel}
          onInputChange={(event, newInputValue) => setStatoSel(newInputValue.toUpperCase())} // Trasforma in uppercase
          renderInput={(params) => (
            <TextField
              {...params}
              label="Stato Pezzo di Ricambio"
              variant="outlined"
              style={{ width: "300px" }}
            />
          )}
          filterOptions={(options, params) => {
            const inputValueUpperCase = params.inputValue.trim().toUpperCase();
            return options.filter((option) =>
              option.toUpperCase().includes(inputValueUpperCase)
            );
          }}
        />
      )}
    </>
  );
}
