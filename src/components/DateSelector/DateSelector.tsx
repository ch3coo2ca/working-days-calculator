import React, { useEffect } from "react";

import moment from "moment";

import { COLOR_BLUE, TYPE_START, TYPE_END, DATE_FORMAT } from "constants/Types";

import Card from "components/Card";
import Text from "components/Text";
import Input from "components/Input";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Calendar from "react-calendar";

type DateSelectorProps = {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (type: string, value: Date) => void;
  onCalculate: () => void;
};

type DateProps = {
  id: string;
  name: string;
  value: Date | null;
  onChange: (id: string, date: Date) => void;
  onToggleCalendar: (id: string) => void;
};

function DateSelector({
  startDate,
  endDate,
  onDateChange,
  onCalculate,
}: DateSelectorProps) {
  const CalculateButton = withStyles({
    root: {
      backgroundColor: COLOR_BLUE,
    },
  })(Button);

  useEffect(() => {
    window.addEventListener("resize", resizeCalendar);
    return () => window.removeEventListener("resize", resizeCalendar);
  }, []);

  /**
   * resize calendar position
   */
  const resizeCalendar = () => {
    let CALENDAR_WIDTH = 350;
    const activeCalendar: HTMLElement | null = document.querySelector(
      ".react-calendar:not(.hide)"
    );

    if (!activeCalendar) return;
    const icon = activeCalendar.previousElementSibling?.previousElementSibling;
    const {
      height,
      left: x,
      top: y,
    } = icon?.getBoundingClientRect() as ClientRect;

    activeCalendar.style.top = `${y + height + 13}px`;

    const { clientWidth } = document.body;
    if (clientWidth < 420) {
      CALENDAR_WIDTH -= 40;
      activeCalendar.style.width = `${CALENDAR_WIDTH}px`;
      activeCalendar.style.left = `${(clientWidth - CALENDAR_WIDTH) / 2}px`;
    } else {
      activeCalendar.style.left = `${x - CALENDAR_WIDTH / 2 + 13}px`;
      activeCalendar.style.width = `${CALENDAR_WIDTH}px`;
    }
  };

  const toggleCalendar = (type: string) => {
    const calendars: HTMLCollectionOf<Element> =
      document.getElementsByClassName("react-calendar");
    const [startCalendar, endCalendar] = calendars;

    if (type === TYPE_START) {
      const isHidden = startCalendar.classList.contains("hide");
      if (isHidden) {
        startCalendar.classList.remove("hide");
        endCalendar.classList.add("hide");
        resizeCalendar();
      } else {
        startCalendar.classList.add("hide");
      }
    }

    if (type === TYPE_END) {
      const isHidden = endCalendar.classList.contains("hide");

      if (isHidden) {
        endCalendar.classList.remove("hide");
        resizeCalendar();
      } else {
        endCalendar.classList.add("hide");
      }
    }
  };

  return (
    <Card className="date-selector">
      <Date
        id={TYPE_START}
        name="Start Date"
        value={startDate}
        onChange={onDateChange}
        onToggleCalendar={toggleCalendar}
      />
      <Date
        id={TYPE_END}
        name="End Date"
        value={endDate}
        onChange={onDateChange}
        onToggleCalendar={toggleCalendar}
      />
      <CalculateButton
        variant="contained"
        color="primary"
        onClick={onCalculate}
      >
        Calculate
      </CalculateButton>
    </Card>
  );
}

function Date({ id, name, value, onChange, onToggleCalendar }: DateProps) {
  const formattedValue = value ? moment(value).format(DATE_FORMAT) : "";
  return (
    <div className="date-wrapper">
      <Text>{name} </Text>
      <div className="date">
        <Input
          type="text"
          value={formattedValue}
          placeholder={DATE_FORMAT}
          readOnly={true}
        />
        <i className="icon-calendar" onClick={() => onToggleCalendar(id)} />
        <Button
          variant="outlined"
          color="primary"
          onClick={() =>
            onChange(
              id,
              moment().set({ hour: 0, minute: 0, second: 0 }).toDate()
            )
          }
        >
          Today
        </Button>
        <Calendar
          className="hide"
          value={value}
          locale="en-US"
          minDetail={"month"}
          nextLabel={<i className="icon-caret-right" />}
          prevLabel={<i className="icon-caret-right flip" />}
          next2Label={<div />}
          prev2Label={<div />}
          showNeighboringMonth={false}
          onChange={(value) => {
            onChange(id, value);
            onToggleCalendar(id);
          }}
        />
      </div>
    </div>
  );
}
export default DateSelector;
