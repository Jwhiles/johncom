import { Link } from "@remix-run/react";

export default function Index() {
  const words = [
    "every girl I ever kissed, I was thinking of a pro footballer",
  ];
  const word = words[Math.floor(Math.random() * words.length)];

  return (
    <div className="text-slate-800">
      <div>{word}</div>
      I'm John! This is my website I hope you like it See my{" "}
      <div>
        <Link to="/sport_quotes">favourite sport quotes here</Link>
      </div>
    </div>
  );
}
