import { FC, Fragment, useEffect, useState } from "react";
import planeImage from "@/assets/Plane.png";
import { LuInfo } from "react-icons/lu";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { useGlobalStore } from "@/context/GlobalStore";
import { Label } from "../ui/label";
import { Flight } from "@/utils/types";

interface SelectorProps {
  selectedSeat: string | null;
  setSelectedSeat: (s: string) => void;
  selected_flight: Flight | null;
}

const Selector: FC<SelectorProps> = (props) => {
  const { selectedSeat, setSelectedSeat, selected_flight } = props;
  const [seatsFromDb, setSeatsFromDb] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    passengers,
    selectedSeat: mainSeat,
    returningSeat,
    selected_flight: goingFlight,
    returning_flight,
  } = useGlobalStore();
  let seatArray: string[] = [];
  const [error, setError] = useState<string | null>(null);
  if (!selected_flight || !goingFlight) {
    return (
      <div className="flex items-center justify-center h-28">
        <Label>No flight selected</Label>
      </div>
    );
  }
  console.log({ mainSeat, returningSeat });
  if (selected_flight.flight_id == goingFlight.flight_id) {
    seatArray = passengers.map(({ seat }) => seat);
    mainSeat && seatArray.push(mainSeat);
  } else if (selected_flight.flight_id == returning_flight?.flight_id) {
    seatArray = passengers.map(({ returningSeat }) => returningSeat);
    returningSeat && seatArray.push(returningSeat);
  } else return <p>Invalid flight selection</p>;
  useEffect(() => {
    const fetchSeats = async (flightId: number) => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_API_URL
          }/api/flights/seats/${flightId}`
        );
        setSeatsFromDb(response.data);
        console.log(response.data)
        setError(null);
      } catch (err) {
        console.error("Error fetching seats", err);
        setError("Failed to load seats. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSeats(selected_flight.flight_id); // Use the selected flight ID
  }, [selected_flight]);

  const rowLength = 24;
  const colLength = 8;

  const columns = Array.from({ length: colLength }, (_, i) =>
    String.fromCharCode("A".charCodeAt(0) + i)
  );
  const rows = Array.from({ length: rowLength }, (_, i) => i + 1);

  return loading ? (
    <FaSpinner className="text-xl animate-spin w-full mx-auto my-auto h-14 text-theme-primary" />
  ) : error ? (
    <div className="text-red-500 text-center">{error}</div>
  ) : (
    <div
      className="bg-no-repeat w-full flex justify-center"
      style={{
        backgroundImage: `url(${planeImage})`,
        backgroundSize: "3050px 3300px",
        backgroundPositionX: "center",
        backgroundPositionY: "15%",
      }}
    >
      <div className="mt-52 flex flex-col justify-center items-center w-80">
        <div className="grid grid-cols-[repeat(9,26px)]">
          {columns.map((col) => (
            <div key={col}>
              <div className="flex justify-center items-center">
                <p className="text-sm font-semibold text-blue-800">{col}</p>
              </div>
              {col == "D" ? <p /> : null}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-9 bg-white rounded-md px-1">
          {rows.map((row) => (
            <Fragment key={row}>
              {columns.map((col) => {
                const seatId = `${row}${col}`;
                const taken = seatsFromDb.includes(seatId);
                return (
                  <Fragment key={seatId}>
                    <button
                      className={
                        "text-center flex items-center justify-center text-sm font-semibold rounded bg-violet-100 hover:bg-violet-200"
                      }
                      style={{
                        backgroundColor: `${
                          selectedSeat === seatId || seatArray.includes(seatId)
                            ? "var(--theme-primary-darker)"
                            : ""
                        }`,
                        height: 32,
                        width: 22,
                        margin: "6px 2px",
                        backgroundImage: `${
                          taken
                            ? "linear-gradient(to bottom, #605DEC, #2A26D9)"
                            : null
                        }`,
                      }}
                      onClick={taken ? () => {} : () => setSelectedSeat(seatId)}
                    ></button>

                    {col == "D" ? (
                      <p
                        className="text-center text-blue-800"
                        style={{
                          height: 32,
                          width: 22,
                          margin: "6px 2px",
                          paddingTop: "3px",
                        }}
                      >
                        {row}
                      </p>
                    ) : null}
                    {col == "H" && row % 6 == 0 ? (
                      <div className="col-span-full h-7 flex items-center gap-2 text-slate-400 pl-1">
                        <LuInfo strokeWidth={3} /> Exit row
                      </div>
                    ) : null}
                  </Fragment>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Selector;
