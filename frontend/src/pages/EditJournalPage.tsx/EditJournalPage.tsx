import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../hooks/redux";

const EditJournalPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div>
      <p>Edit</p>
    </div>
  );
};

export default EditJournalPage;
