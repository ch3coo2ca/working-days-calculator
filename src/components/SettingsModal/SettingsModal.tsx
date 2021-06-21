import React, { useState } from "react";

import moment from "moment";
import Calendar from "react-calendar";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Input from "components/Input";

type SettingsModalProps = {
  open: boolean;
  settings: { endDate: string; title: string } | null;
  onClose: () => void;
  onSave: (value: { title: string; date: Date }) => void;
};

function SettingsModal({
  open,
  settings,
  onClose,
  onSave,
}: SettingsModalProps) {
  const [date, setDate] = useState<Date>(
    settings ? moment(settings.endDate).toDate() : moment().toDate()
  );
  const [title, setTitle] = useState<string>(settings ? settings.title : "");
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const handleChangeDate = (value: Date) => {
    setDate(value);
  };

  const handleChange = (type: string, value: string) => {
    if (type === "title") setTitle(value);
  };

  const toggleCalendar = () => {
    setShowCalendar((prevState) => !prevState);
  };

  const formattedValue = date && moment(date).format("YYYY/MM/DD");
  return (
    <Dialog
      maxWidth="xs"
      fullWidth={true}
      open={open}
      className="settings-modal christmas-theme"
    >
      <DialogTitle> D-Day Settings</DialogTitle>
      <DialogContent>
        <div className="settings">
          <div className="title"> D-Day Title</div>
          <Input
            type="text"
            value={title || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("title", e.target.value)
            }
          />
        </div>
        <div className="settings">
          <div className="title"> End Date</div>
          <Input
            type="text"
            value={formattedValue || ""}
            placeholder="YYYY/MM/DD"
            readOnly={true}
          />
          <i className="icon-calendar" onClick={toggleCalendar} />
        </div>
        {showCalendar && (
          <Calendar
            value={date}
            locale="en-US"
            minDetail={"month"}
            showNeighboringMonth={false}
            onChange={handleChangeDate}
            nextLabel={<i className="icon-caret-right" />}
            prevLabel={<i className="icon-caret-right flip" />}
            next2Label={<div />}
            prev2Label={<div />}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onSave({ title, date })} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SettingsModal;
