"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Wrapper from "../components/Wrapper";
import Notification from "../components/Notification";
import { useUser } from "@clerk/nextjs";
import EmojiPicker from "emoji-picker-react";
import { addBudget } from "../actions";

const Page = () => {
  const { user } = useUser();
  const [budgetName, setBudgetName] = useState<string>("");
  const [budgetAmount, setBudgetAmount] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");

  const handleEmojiSelect = (emojiObject: { emoji: string }) => {
    setSelectedEmoji(emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const [notification, setNotification] = useState<string>("");
  const closeNotification = () => {
    setNotification("")
  }

  const handleAddBudget = async () => {
    try {
      const amount = parseFloat(budgetAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Le montant doit être un nombre positif.");
      }

      await addBudget (
        user?.primaryEmailAddress?.emailAddress as string ,
        budgetName,
        amount ,
        selectedEmoji,
      )

      const modal = document.getElementById("my_modal_3") as HTMLDialogElement

      if(modal){
        modal.close()
      }

      setNotification('Nouveau budget créé avec succès.')
      setBudgetName("")
      setBudgetAmount("")
      setSelectedEmoji("")
      setShowEmojiPicker(false)


    } catch (error) {
      setNotification(`Erreur : ${error}`)
    }
  };

   
  return (

    <Wrapper>
    {notification && (
      <Notification message={notification} onClose={closeNotification} />
    )}
    <button
      className="btn"
      onClick={() =>
        (document.getElementById("my_modal_3") as HTMLDialogElement).showModal()
      }
    >
      Nouveau Budget
    </button>
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Création d'un budget</h3>
        <p className="py-4">Permet de contrôler ses dépenses</p>
        <div className="w-full flex flex-col">
          <input
            type="text"
            value={budgetName}
            placeholder="Nom du budget"
            onChange={(e) => setBudgetName(e.target.value)}
            className="input input-bordered mb-3"
            required
          />
          <input
            type="text"
            value={budgetAmount}
            placeholder="Montant du budget"
            onChange={(e) => setBudgetAmount(e.target.value)}
            className="input input-bordered mb-3"
            required
          />
          <button
            className="btn mb-3"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            {selectedEmoji || "Sélectionnez un emoji 🫵"}
          </button>
          {showEmojiPicker && (
            <div className="flex justify-center items-center my-4">
              <EmojiPicker onEmojiClick={handleEmojiSelect} />
            </div>
          )}
          <button onClick={handleAddBudget} className="btn">
            Ajouter Budget
          </button>
        </div>
      </div>
    </dialog>
  </Wrapper>
);
};

export default Page;