import planeImage from "@/assets/Plane.png";

interface SelectorProps {
  selectedSeat: string | null;
  setSelectedSeat: React.Dispatch<React.SetStateAction<string | null>>;
}

let seatsFromDb = [true, false, true];
seatsFromDb = Array.from({ length: 30 * 8 }, (_, i) => i % 15 == 0 || i % 13 == 0);

const Selector = (props: SelectorProps) => {
  const rowLength = 30;
  const colLength = 8;
  let index = 0;
  const columns = Array.from({ length: colLength }, (_, i) =>
    String.fromCharCode("A".charCodeAt(0) + i)
  );
  const rows = Array.from({ length: rowLength }, (_, i) => i + 1);
  const { selectedSeat, setSelectedSeat } = props;

  const handleSeatClick = (seat: string, row: number, col: string) => {
    if (seatsFromDb[(row - 1) * colLength + col.charCodeAt(0) - "A".charCodeAt(0)] === false) setSelectedSeat(seat);
    console.log((row - 1) * colLength + col.charCodeAt(0) - "A".charCodeAt(0));
    console.log(seatsFromDb);
  };
  return (
    <div
      className="bg-no-repeat w-full flex justify-center"
      style={{
        backgroundImage: `url(${planeImage})`,
        backgroundSize: "3000px 2000px",
        backgroundPositionX: "center",
        backgroundPositionY: "15%",
      }}
    >
      <div className="mt-52 flex justify-center items-center w-80">
        <div className="grid grid-cols-9">
          {columns.map((col) => (
            <>
              <div className="flex justify-center items-center">
                <p className="text-sm font-semibold text-blue-800">{col}</p>
              </div>
              {col == "D" ? <p /> : null}
            </>
          ))}
          {rows.map((row) => (
            <>
              {columns.map((col) => {
                const seatId = `${col}${row}`;
                return (
                  <>
                    <button
                      key={seatId}
                      className={
                        "text-center flex items-center justify-center text-sm font-semibold rounded hover:bg-white"
                      }
                      style={{
                        backgroundColor: `${selectedSeat === seatId ? "green" : ""}`,
                        height: 32,
                        width: 22,
                        margin: "6px 2px",
                        backgroundImage: `${
                          seatsFromDb[index++]
                            ? "linear-gradient(to bottom, #605DEC, #2A26D9)"
                            : null
                        }`,
                      }}
                      onClick={() => handleSeatClick(seatId, row, col)}
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
                  </>
                );
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Selector;
