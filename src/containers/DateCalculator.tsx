import React, { useState, useEffect, useRef } from "react";

import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import moment from "moment";

import {
  TYPE_START,
  TYPE_END,
  COLOR_BLUE,
  SETTINGS_KEY,
  DATE_FORMAT,
  COUNTRY_KEY,
} from "constants/Types";

import DateSelector from "components/DateSelector";
import Card from "components/Card";
import ProgressBar from "components/ProgressBar";
import SettingsModal from "components/SettingsModal";
import TimeCounter from "components/TimeCounter";
import CountrySelector from "components/CountrySelector";

import { getWorkingDaysCount } from "utils/Calculate";
import { getLocalStorage, setLocalStorage } from "utils/Storage";
import { getRandomMessage } from "utils/Message";

type SettingsInfoProps = {
  settings: { title: string; endDate: string };
  countryCode: string;
  onLoadSettings: () => void;
  onOpenSettings: () => void;
  onSelectCountry: (code: string) => void;
};

type AddEventArgs = {
  onClick: () => void;
};

const AddEvent = ({ onClick }: AddEventArgs) => {
  const AddButton = withStyles({
    root: {
      backgroundColor: COLOR_BLUE,
      color: "white",
      justifySelf: "end",
    },
  })(Button);
  return (
    <AddButton
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={onClick}
    >
      Add a new event
    </AddButton>
  );
};

function SettingsInfo({
  settings,
  countryCode,
  onLoadSettings,
  onOpenSettings,
  onSelectCountry,
}: SettingsInfoProps) {
  return (
    <div className="settings-info">
      <CountrySelector code={countryCode} onSelect={onSelectCountry} />

      <Button
        variant="contained"
        color="primary"
        onClick={onLoadSettings}
        className="title"
      >
        {settings.title}
      </Button>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<EditIcon />}
        onClick={onOpenSettings}
      >
        Edit
      </Button>
    </div>
  );
}
const DateCalculator = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const prevEndDate = usePrevious(endDate);

  const [workDays, setWorkDays] = useState<number | string>("-");
  const [calendarDays, setCalendarDays] = useState<number | string>("-");
  const [percent, setPercent] = useState<number>(0);
  const [message, setMessage] = useState<string>("🎁");

  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [settings, setSettings] =
    useState<{ title: string; endDate: string } | null>(null);
  const [countryCode, setCountryCode] = useState<string>("");

  const [showTimer, setTimer] = useState(false);

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  useEffect(() => {
    const isStartDateToday =
      moment(startDate).format(DATE_FORMAT) === moment().format(DATE_FORMAT);

    const isEndDateSame =
      moment(prevEndDate).format(DATE_FORMAT) ===
      moment(endDate).format(DATE_FORMAT);

    if (isStartDateToday && isEndDateSame) return;
    setTimer(false);
  }, [startDate, endDate]);

  function usePrevious(value: Date | null) {
    const ref = useRef<Date | null>(null);
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const loadFromLocalStorage = () => {
    const settings = getLocalStorage(SETTINGS_KEY);
    const countryCode = getLocalStorage(COUNTRY_KEY);
    if (!settings) return;

    const { endDate } = settings;
    const [year, month, date] = endDate.split("/");

    setStartDate(moment().set({ h: 0, m: 0, s: 0 }).toDate());
    setEndDate(moment({ year, month: month - 1, date }).toDate());
    setSettings(settings);
    setCountryCode(countryCode);
  };

  const toggleOpen = () => {
    setOpenSettings((prevState) => !prevState);
  };

  const handleDateChange = (type: string, value: Date) => {
    if (type === TYPE_START) setStartDate(value);
    if (type === TYPE_END) setEndDate(value);
  };

  const handleCalculate = () => {
    if (
      !startDate ||
      !endDate ||
      endDate < startDate ||
      startDate === endDate
    ) {
      initData();
      return;
    }

    const calculated = getWorkingDaysCount(countryCode, startDate, endDate);

    if (!calculated) {
      const requiredMsg = document.querySelector(".required") as HTMLElement;
      requiredMsg?.classList.toggle("show");

      setTimeout(() => {
        requiredMsg.classList.toggle("show");
      }, 2000);
      return;
    }

    const { calendarDays, workDays } = calculated;
    setCalendarDays(calendarDays);
    setWorkDays(workDays);

    const baseDate = moment(endDate).subtract(2, "years");
    const passedDates = moment(startDate).diff(moment(baseDate), "days") + 1;
    const percent = (passedDates / (365 * 2)) * 100;

    if (percent < 0 || percent > 100) {
      setPercent(0);
    } else {
      setPercent(Number.parseFloat(percent.toFixed(1)));
    }

    const isStartDateToday =
      moment(startDate).format(DATE_FORMAT) === moment().format(DATE_FORMAT);
    if (isStartDateToday) setTimer(true);

    const randomMessage = getRandomMessage(calendarDays);
    setMessage(randomMessage);
  };

  const handleSaveSettings = (data: { title: string; date: Date }) => {
    const { title, date } = data;
    const ddaySettings = {
      title,
      endDate: moment(date).format(DATE_FORMAT),
    };

    setLocalStorage(SETTINGS_KEY, ddaySettings);
    toggleOpen();

    loadFromLocalStorage();
  };

  const handleSelectCountry = (code: string) => {
    if (typeof code !== "string") return;

    setLocalStorage(COUNTRY_KEY, code);

    initData();
    loadFromLocalStorage();
  };

  const initData = () => {
    setWorkDays("-");
    setCalendarDays("-");
    setPercent(0);
    setTimer(false);
    setMessage("🎁");
  };

  const isKR = countryCode === "KR";

  return (
    <div className="main-content">
      <div className="content-wrapper">
        {settings ? (
          <SettingsInfo
            settings={settings}
            countryCode={countryCode}
            onOpenSettings={toggleOpen}
            onLoadSettings={loadFromLocalStorage}
            onSelectCountry={handleSelectCountry}
          />
        ) : (
          <AddEvent onClick={toggleOpen} />
        )}
        <DateSelector
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
          onCalculate={handleCalculate}
        />
        <Card align="left">
          <i className="icon-work" />
          {workDays || "-"} working days
        </Card>
        <Card align="left">
          <i className="icon-date" />
          {calendarDays || "-"} calendar days
        </Card>
        {isKR && <ProgressBar value={percent} />}
        <TimeCounter endDate={showTimer ? endDate : null} />

        {isKR && <Card>{message}</Card>}

        {openSettings && (
          <SettingsModal
            open={openSettings}
            settings={settings || null}
            onClose={toggleOpen}
            onSave={handleSaveSettings}
          />
        )}
      </div>
    </div>
  );
};

export default DateCalculator;
