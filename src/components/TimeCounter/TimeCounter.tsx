import React, { useEffect, useState } from "react";

import moment from "moment";

import Card from "components/Card";

type TimeCounterProps = {
  endDate: Date | null;
};

type Time = {
  days: number | string | undefined;
  hours: number | string | undefined;
  minutes: number | string | undefined;
  seconds: number | string | undefined;
};

type TimeCardProps = {
  title: string;
  value: number | string | undefined;
};

function TimeCounter({ endDate }: TimeCounterProps) {
  const [timeleft, setTimeleft] = useState<Time | null>(null);
  let timer: ReturnType<typeof setInterval>;

  useEffect(() => {
    timer = setInterval(() => {
      const end = moment(endDate);
      const now = moment();
      const diff = end.diff(now);

      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor(diff / 1000 / 60) % 60;
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      setTimeleft({
        days: isNaN(days) ? "-" : days,
        hours: isNaN(hours) ? "-" : hours,
        minutes: isNaN(minutes) ? "-" : minutes,
        seconds: isNaN(seconds) ? "-" : seconds,
      });
    }, 1000);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [endDate]);

  return (
    <Card className="gradient time-counter">
      <TimeCard title={"DAYS"} value={timeleft?.days} />
      <Colon />
      <TimeCard title={"HOURS"} value={timeleft?.hours} />
      <Colon />
      <TimeCard title={"MINUTES"} value={timeleft?.minutes} />
      <Colon />
      <TimeCard title={"SECONDS"} value={timeleft?.seconds} />
    </Card>
  );
}

function TimeCard({ title, value = "-" }: TimeCardProps) {
  return (
    <div className="time-card">
      <div className="time"> {value}</div>
      <div className="type"> {title} </div>
    </div>
  );
}

function Colon() {
  return (
    <div className="colon">
      <i className="icon-colon" />
    </div>
  );
}
export default TimeCounter;
