import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "./redux";
import { useState } from "react";
import JournalEntry from "@models/JournalEntry";
import {
  createJournalEntry,
  updateJournalEntry,
} from "../store/slices/journalSlice";
import { toast } from "react-toastify";

export const useJournalSave = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleJournalSave = async (
    payload: JournalEntry,
    journalId: string | undefined,
    isEditMode: boolean
  ) => {
    setIsSaving(true);

    try {
      if (isEditMode && journalId) {
        await dispatch(updateJournalEntry({ id: journalId, data: payload }));
        toast.success("Journal entry updated successfully!");
      } else {
        await dispatch(createJournalEntry(payload)).unwrap();
        toast.success("Journal entry saved successfully!");
      }

      navigate(-1);
    } catch (error: unknown) {
      const err = error as Error;
      console.log(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return { handleJournalSave, isSaving };
};
