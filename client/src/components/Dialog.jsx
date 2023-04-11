import React, { useState } from "react";
import {
  Dialog as DialogComponent,
  DialogActionsBar,
} from "@progress/kendo-react-dialogs";
import { Input } from "@progress/kendo-react-inputs";
import { getName } from "../helper/helperMethods";
import { Button } from "@progress/kendo-react-buttons";

export const EditDialog = (props) => {
  const [inputValue, setInputValue] = useState(props.editValue);

  const handleDialogClick = (e) => {
    props.onDialogClick({
      e,
      path: props.editValue.path,
      value: typeof inputValue === "string" ? inputValue : inputValue.path,
      type: e.target.value,
    });
  };

  const handleDialogClose = (e) => {
    props.onDialogClose(e);
  };

  const handleInputChange = (e) => {
    setInputValue(e.value);
  };

  return (
    <DialogComponent title={"Please confirm"} onClose={handleDialogClose}>
      <p style={{ width: "350px", margin: "25px", textAlign: "center" }}>
        Enter new name for the file.
      </p>
      <Input
        maxLength={40}
        value={getName(inputValue.path)}
        style={{ width: "350px", margin: "25px", textAlign: "center" }}
        className={"k-textbox"}
        onChange={handleInputChange}
      />
      <DialogActionsBar>
        <Button
          value={"rename"}
          themeColor="primary"
          onClick={handleDialogClick}
        >
          Rename
        </Button>
        <Button value={"cancel"} themeColor="base" onClick={handleDialogClick}>
          Cancel
        </Button>
      </DialogActionsBar>
    </DialogComponent>
  );
};

export const DeleteDialog = (props) => {
  const handleDialogClick = (e) => {
    props.onDialogClick({
      e,
      type: e.target.value,
    });
  };

  const handleDialogClose = (e) => {
    props.onDialogClose(e);
  };

  return (
    <DialogComponent title={"Please confirm"} onClose={handleDialogClose}>
      <p style={{ width: "350px", margin: "25px", textAlign: "center" }}>
        Are you sure you want to delete the selected file? You cannot undo this
        action.
      </p>
      <DialogActionsBar>
        <Button
          value={"delete"}
          themeColor="primary"
          onClick={handleDialogClick}
        >
          Delete
        </Button>
        <Button value={"cancel"} themeColor="base" onClick={handleDialogClick}>
          Cancel
        </Button>
      </DialogActionsBar>
    </DialogComponent>
  );
};
