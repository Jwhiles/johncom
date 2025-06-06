import { cssBundleHref } from "@remix-run/css-bundle";
import { Link } from "@remix-run/react";
import libStyle from "~/styles/library.css?url";

export function links() {
  return [
    { rel: "stylesheet", href: libStyle },

    ...(cssBundleHref ? [{ rel: "stylesheet", href: libStyle }] : []),
  ];
}

type Olid = { olid: string };
type Isbn = { isbn: string };
interface LibraryEntry {
  title: string;
  author: string;

  /*
   * Open Library ID
   * - I'm using this to get covers from their cover API
   *   But maybe at some point I want to like, take a photo of my copy of a book?
   *   I guess I'll think about that when I get there.
   */
  id: Olid | Isbn;

  // TODO: granularity?
  started: string;
  stopped?: string;
  finished: boolean;
  links: Array<{
    title: string;
    url: string;
  }>;
}

type Library = Array<LibraryEntry>;

const library: Library = [
  {
    title: "The Rings of Saturn",
    author: "W.G. Sebald",
    id: { olid: "OL699789M" },
    started: "2025-05-27",
    finished: false,
    links: [],
  },
  {
    title: "1Q84",
    author: "Haruki Murakami",
    id: { olid: "OL24839567M" },
    started: "2025-05-9",
    finished: false,
    links: [],
  },
  {
    title: "The collected stories of Lydia Davis",
    author: "Lydia Davis",
    id: { olid: "OL23575807M" },
    started: "2025-04-20",
    stopped: "2025-05-01",
    finished: false,
    links: [],
  },
  {
    title: "2666",
    author: "Roberto Bolaño",
    id: { olid: "OL16820215M" },
    started: "2025-04-01",
    stopped: "2025-05-9",
    finished: true,
    links: [],
  },
  {
    title: "The Buried Giant",
    author: "Kazuo Ishiguro",
    id: { olid: "OL27098892M" },
    started: "2024-09",
    stopped: "2024-09",
    finished: true,
    links: [],
  },
  {
    title: "Either/Or",
    author: "Elif Batuman",
    id: { olid: "OL46844720M" },
    started: "2024-08",
    stopped: "2024-08",
    finished: true,
    links: [],
  },
  {
    title: "The Fifth Head of Cerberus",
    author: "Gene Wolfe",
    id: { olid: "OL26367950M" },
    started: "2024-07",
    stopped: "2024-07",
    finished: true,
    links: [],
  },
  {
    title: "From Bauhaus to Our House",
    author: "Tom Wolfe",
    id: { olid: "OL7826486M" },
    started: "2024-05",
    stopped: "2024-05",
    finished: true,
    links: [],
  },

  {
    title: "Austerlitz",
    author: "W.G. Sebald",
    started: "2024-04-20",
    stopped: "2024-05-09",
    finished: true,
    id: {
      isbn: "0140297995",
    },
    links: [],
  },
  {
    title: "Berlin Game (Bernard Samson, #1)",
    author: "Len Deighton",
    started: "2024-04-20",
    stopped: "",
    finished: true,
    id: {
      isbn: "0345418344",
    },
    links: [],
  },
  {
    title: "The Great Crash 1929",
    author: "John Kenneth Galbraith",
    started: "2024-04-02",
    stopped: "2024-04-20",
    finished: true,
    id: {
      isbn: "0395859999",
    },
    links: [],
  },
  {
    title: "Mating",
    author: "Norman Rush",
    started: "2024-04-02",
    stopped: "2024-04-01",
    finished: true,
    id: {
      isbn: "067973709X",
    },
    links: [],
  },
  {
    title: "Tidy First?: A Personal Exercise in Empirical Software Design",
    author: "Kent Beck",
    started: "2024-02-26",
    stopped: "2024-02-26",
    finished: true,
    id: {
      isbn: "1098151240",
    },
    links: [],
  },
  {
    title: "Hound of the Baskervilles [Paperback]",
    author: "Arthur Conan Doyle",
    started: "2024-01-13",
    stopped: "2024-01-15",
    finished: true,
    id: {
      isbn: "0143427032",
    },
    links: [],
  },
  {
    title: "Stay True",
    author: "Hua Hsu",
    started: "2024-01-06",
    stopped: "2024-01-11",
    finished: true,
    id: {
      isbn: "0385547773",
    },
    links: [],
  },
  {
    title: "Christie Malry's Own Double-Entry",
    author: "B.S. Johnson",
    started: "2024-01-02",
    stopped: "2024-01-04",
    finished: true,
    id: {
      isbn: "0330484826",
    },
    links: [],
  },
  {
    title: "Crash",
    author: "J.G. Ballard",
    started: "2023-12-14",
    stopped: "2023-12-16",
    finished: true,
    id: {
      isbn: "0312420331",
    },
    links: [],
  },
  {
    title: "Count Zero (Sprawl, #2)",
    author: "William Gibson",
    started: "2023-12-04",
    stopped: "2023-12-12",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "The Mezzanine",
    author: "Nicholson Baker",
    started: "2023-11-21",
    stopped: "2021-08-23",
    finished: true,
    id: {
      isbn: "0679725768",
    },
    links: [],
  },

  {
    title:
      "Land is a Big Deal: Why rent is too high, wages too low, and what we can do about it",
    author: "Lars A. Doucet",
    started: "2023-11-12",
    stopped: "2023-11-14",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "Pattern Recognition (Blue Ant, #1)",
    author: "William Gibson",
    started: "2023-11-09",
    stopped: "2023-11-09",
    finished: true,
    id: {
      isbn: "0425198685",
    },
    links: [],
  },
  {
    title: "Trip: Psychedelics, Alienation, and Change",
    author: "Tao Lin",
    started: "2021-03-24",
    stopped: "2021-03-24",
    finished: true,
    id: {
      isbn: "1101974516",
    },
    links: [],
  },
  {
    title: "Titus Groan (Gormenghast, #1)",
    author: "Mervyn Peake",
    started: "2021-04",
    stopped: "2021-04",
    finished: true,
    id: {
      isbn: "0879514256",
    },
    links: [],
  },
  {
    title: "The Annotated Lolita",
    author: "Vladimir Nabokov",
    started: "2021-03-24",
    stopped: "2021-03-24",
    finished: true,
    id: {
      isbn: "0679727299",
    },
    links: [],
  },
  {
    title: "The Fire Next Time",
    author: "James Baldwin",
    started: "2021-02-09",
    stopped: "2021-03-06",
    finished: true,
    id: {
      isbn: "067974472X",
    },
    links: [],
  },
  {
    title: "In Praise of Shadows",
    author: "Jun'ichirō Tanizaki",
    started: "2021-02-09",
    stopped: "2021-02-22",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "Goodbye to Berlin",
    author: "Christopher Isherwood",
    started: "2021-02-09",
    stopped: "2021-02-22",
    finished: true,
    id: {
      isbn: "0586047956",
    },
    links: [],
  },
  {
    title: "The Longing for Less: Living with Minimalism (Wolf Brother)",
    author: "Kyle Chayka",
    started: "2021-01-25",
    stopped: "2021-01-29",
    finished: true,
    id: {
      isbn: "163557210X",
    },
    links: [],
  },
  {
    title:
      "Attached: The New Science of Adult Attachment and How It Can Help You Find—and Keep—Love",
    author: "Amir Levine",
    started: "2021-01-25",
    stopped: "2021-01-29",
    finished: true,
    id: {
      isbn: "1585428485",
    },
    links: [],
  },
  {
    title: "K-punk: The Collected and Unpublished Writings of Mark Fisher",
    author: "Mark Fisher",
    started: "2021-01-19",
    stopped: "2021-02-09",
    finished: true,
    id: {
      isbn: "1912248298",
    },
    links: [],
  },
  {
    title: "Having and Being Had",
    author: "Eula Biss",
    started: "2021-01-08",
    stopped: "2021-01-11",
    finished: true,
    id: {
      isbn: "0525537457",
    },
    links: [],
  },
  {
    title: "Neuromancer (Sprawl, #1)",
    author: "William Gibson",
    started: "2021-01-02",
    stopped: "",
    finished: true,
    id: {
      isbn: "110114646X",
    },
    links: [],
  },
  {
    title:
      "Finite and Infinite Games: A Vision of Life as Play and Possibility",
    author: "James P. Carse",
    started: "2021-01-02",
    stopped: "2021-01-17",
    finished: true,
    id: {
      isbn: "0345341848",
    },
    links: [],
  },
  {
    title: "Dracula",
    author: "Bram Stoker",
    started: "2021-01-02",
    stopped: "",
    finished: true,
    id: {
      isbn: "0393970124",
    },
    links: [],
  },
  {
    title: "Pale Fire",
    author: "Vladimir Nabokov",
    started: "2021-01-02",
    stopped: "",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "Laughter in the Dark",
    author: "Vladimir Nabokov",
    started: "2021-01-02",
    stopped: "",
    finished: true,
    id: {
      isbn: "0811216748",
    },
    links: [],
  },
  {
    title: "Moab Is My Washpot",
    author: "Stephen Fry",
    started: "2021-01-01",
    stopped: "2021-01-03",
    finished: true,
    id: {
      isbn: "1616951451",
    },
    links: [],
  },
  {
    title: "The Dispossessed: An Ambiguous Utopia",
    author: "Ursula K. Le Guin",
    started: "2020-12-28",
    stopped: "2020-12-30",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title:
      "The Art of Strategy: A Game Theorist's Guide to Success in Business and Life",
    author: "Avinash K. Dixit",
    started: "2020-11-11",
    stopped: "2020-12-27",
    finished: true,
    id: {
      isbn: "0393062430",
    },
    links: [],
  },
  {
    title: "Breaking Smart Archives: Selected Newsletters, 2015-19",
    author: "Venkatesh  Rao",
    started: "2020-07-15",
    stopped: "2020-07-15",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "Be Slightly Evil: A Playbook for Sociopaths (Ribbonfarm Roughs)",
    author: "Venkatesh G. Rao",
    started: "2020-07-15",
    stopped: "2020-07-15",
    finished: true,
    id: {
      isbn: "098270304X",
    },
    links: [],
  },
  {
    title:
      "Extreme Cities: The Peril and Promise of Urban Life in the Age of Climate Change",
    author: "Ashley Dawson",
    started: "2020-06-13",
    stopped: "2020-11-11",
    finished: true,
    id: {
      isbn: "1784780375",
    },
    links: [],
  },
  {
    title: "The Swimming-Pool Library",
    author: "Alan Hollinghurst",
    started: "2020-06-13",
    stopped: "2020-07-15",
    finished: true,
    id: {
      isbn: "0679722564",
    },
    links: [],
  },
  {
    title:
      "Accelerate: Building and Scaling High Performing Technology Organizations",
    author: "Nicole Forsgren",
    started: "2020-05-21",
    stopped: "2020-05-25",
    finished: true,
    id: {
      isbn: "1942788339",
    },
    links: [],
  },
  {
    title: "Xenos (Eisenhorn, #1)",
    author: "Dan Abnett",
    started: "2020-05-02",
    stopped: "2020-04-27",
    finished: true,
    id: {
      isbn: "0743411692",
    },
    links: [],
  },
  {
    title: "The Quest of the Simple Life",
    author: "William James Dawson",
    started: "2020-04-09",
    stopped: "2020-04-08",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "Known and Strange Things: Essays",
    author: "Teju Cole",
    started: "2020-03-24",
    stopped: "2020-11-11",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "The Golden House",
    author: "Salman Rushdie",
    started: "2020-03-15",
    stopped: "2020-03-14",
    finished: true,
    id: {
      isbn: "0399592806",
    },
    links: [],
  },
  {
    title: "The Importance of Being Earnest",
    author: "Oscar Wilde",
    started: "2020-03-15",
    stopped: "2020-02-28",
    finished: true,
    id: {
      isbn: "158049580X",
    },
    links: [],
  },
  {
    title: "Venus in Furs",
    author: "Leopold von Sacher-Masoch",
    started: "2020-03-15",
    stopped: "2020-03-06",
    finished: true,
    id: {
      isbn: "0140447814",
    },
    links: [],
  },
  {
    title: "The Rider",
    author: "Tim Krabbé",
    started: "2020-02-06",
    stopped: "",
    finished: true,
    id: {
      isbn: "1582342903",
    },
    links: [],
  },
  {
    title: "An Elegant Puzzle: Systems of Engineering Management",
    author: "Will Larson",
    started: "2020-01-23",
    stopped: "2020-03-23",
    finished: true,
    id: {
      isbn: "1953953336",
    },
    links: [],
  },
  {
    title: "The One-Straw Revolution",
    author: "Masanobu Fukuoka",
    started: "2020-01-23",
    stopped: "2019-01-01",
    finished: true,
    id: {
      isbn: "8185569312",
    },
    links: [],
  },
  {
    title: "Being Ecological",
    author: "Timothy Morton",
    started: "2020-01-23",
    stopped: "",
    finished: true,
    id: {
      isbn: "0241274230",
    },
    links: [],
  },
  {
    title: "Dune (Dune, #1)",
    author: "Frank Herbert",
    started: "2019-12-29",
    stopped: "2020-03-15",
    finished: true,
    id: {
      isbn: "059309932X",
    },
    links: [],
  },
  {
    title: "Flashman in the Great Game (Flashman Papers #5)",
    author: "George MacDonald Fraser",
    started: "2019-12-29",
    stopped: "2019-12-29",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "How to Do Nothing: Resisting the Attention Economy",
    author: "Jenny Odell",
    started: "2019-12-10",
    stopped: "2020-01-09",
    finished: true,
    id: {
      isbn: "1612197493",
    },
    links: [],
  },
  {
    title: "Trick Mirror: Reflections on Self-Delusion",
    author: "Jia Tolentino",
    started: "2019-12-10",
    stopped: "2019-12-18",
    finished: true,
    id: {
      isbn: "0525510540",
    },
    links: [],
  },
  {
    title: "Flashman at the Charge (Flashman Papers, #4)",
    author: "George MacDonald Fraser",
    started: "2019-12-02",
    stopped: "2019-12-09",
    finished: true,
    id: {
      isbn: "0006512984",
    },
    links: [],
  },
  {
    title: "The Lathe of Heaven",
    author: "Ursula K. Le Guin",
    started: "2017-05-27",
    stopped: "2017-05-27",
    finished: true,
    id: {
      isbn: "0060512741",
    },
    links: [],
  },
  {
    title: "Ghost World",
    author: "Daniel Clowes",
    started: "2017-04-05",
    stopped: "",
    finished: true,
    id: {
      isbn: "1560974273",
    },
    links: [],
  },
  {
    title: "Philosophy in the Boudoir",
    author: "Marquis de Sade",
    started: "2017-04-05",
    stopped: "",
    finished: true,
    id: {
      isbn: "0143039016",
    },
    links: [],
  },
  {
    title: "The Long Dark Tea-Time of the Soul (Dirk Gently, #2)",
    author: "Douglas Adams",
    started: "2017-03-12",
    stopped: "",
    finished: true,
    id: {
      isbn: "0671742515",
    },
    links: [],
  },
  {
    title: "Just Ride: A Radically Practical Guide to Riding Your Bike",
    author: "Grant Petersen",
    started: "2017-03-04",
    stopped: "2016-03-01",
    finished: true,
    id: {
      isbn: "0761155589",
    },
    links: [],
  },
  {
    title: "Speak, Memory",
    author: "Vladimir Nabokov",
    started: "2017-03-01",
    stopped: "",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "A Wizard of Earthsea (Earthsea Cycle, #1)",
    author: "Ursula K. Le Guin",
    started: "2017-03-01",
    stopped: "",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "The Left Hand of Darkness",
    author: "Ursula K. Le Guin",
    started: "2017-03-01",
    stopped: "",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "Ada, or Ardor: A Family Chronicle",
    author: "Vladimir Nabokov",
    started: "2017-03-01",
    stopped: "",
    finished: true,
    id: {
      isbn: "0679725229",
    },
    links: [],
  },
  {
    title: "Happy City: Transforming Our Lives Through Urban Design",
    author: "Charles Montgomery",
    started: "2017-03-01",
    stopped: "",
    finished: true,
    id: {
      isbn: "0385669127",
    },
    links: [],
  },
  {
    title: "Invisible Monsters Remix",
    author: "Chuck Palahniuk",
    started: "2015-02-06",
    stopped: "2015-02-06",
    finished: true,
    id: {
      isbn: "0393083527",
    },
    links: [],
  },
  {
    title: "The Trial",
    author: "Franz Kafka",
    started: "2015-01-15",
    stopped: "2015-01-15",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    started: "2015-01-15",
    stopped: "2015-01-15",
    finished: true,
    id: {
      isbn: "1441341706",
    },
    links: [],
  },
  {
    title: "Chavs: The Demonization of the Working Class",
    author: "Owen   Jones",
    started: "2014-12-21",
    stopped: "2014-12-21",
    finished: true,
    id: {
      isbn: "184467696X",
    },
    links: [],
  },
  {
    title: "King, Queen, Knave",
    author: "Vladimir Nabokov",
    started: "2014-11-30",
    stopped: "2014-11-30",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "Remainder",
    author: "Tom McCarthy",
    started: "2014-11-30",
    stopped: "2014-11-30",
    finished: true,
    id: {
      isbn: "0307278352",
    },
    links: [],
  },
  {
    title: "The Accidental",
    author: "Ali Smith",
    started: "2014-11-30",
    stopped: "2014-11-30",
    finished: true,
    id: {
      isbn: "1400032180",
    },
    links: [],
  },
  {
    title: "Stoner",
    author: "John  Williams",
    started: "2014-11-30",
    stopped: "2014-11-30",
    finished: true,
    id: {
      isbn: "1590171993",
    },
    links: [],
  },
  {
    title: "The 39 Steps (Richard Hannay, #1)",
    author: "John Buchan",
    started: "2014-10-15",
    stopped: "",
    finished: true,
    id: {
      isbn: "1419151126",
    },
    links: [],
  },
  {
    title: "Swallowing Geography",
    author: "Deborah Levy",
    started: "2014-10-11",
    stopped: "2014-10-11",
    finished: true,
    id: {
      isbn: "0224027298",
    },
    links: [],
  },
  {
    title: "On Photography",
    author: "Susan Sontag",
    started: "2014-10-11",
    stopped: "2014-10-11",
    finished: true,
    id: {
      isbn: "0141187166",
    },
    links: [],
  },
  {
    title: "What We See When We Read",
    author: "Peter Mendelsund",
    started: "2014-09-16",
    stopped: "2014-09-16",
    finished: true,
    id: {
      isbn: "0804171637",
    },
    links: [],
  },
  {
    title: "White Noise",
    author: "Don DeLillo",
    started: "2014-09-16",
    stopped: "2014-09-16",
    finished: true,
    id: {
      isbn: "0140283307",
    },
    links: [],
  },
  {
    title: "As I Lay Dying",
    author: "William Faulkner",
    started: "2014-09-15",
    stopped: "2014-09-15",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "The Broom of the System",
    author: "David Foster Wallace",
    started: "2014-08-28",
    stopped: "",
    finished: true,
    id: {
      isbn: "0142002429",
    },
    links: [],
  },
  {
    title: "Men in Space",
    author: "Tom McCarthy",
    started: "2014-08-27",
    stopped: "2014-08-25",
    finished: true,
    id: {
      isbn: "1846880335",
    },
    links: [],
  },
  {
    title: "Colorless Tsukuru Tazaki and His Years of Pilgrimage",
    author: "Haruki Murakami",
    started: "2014-08-20",
    stopped: "",
    finished: true,
    id: {
      isbn: "0385352107",
    },
    links: [],
  },
  {
    title: "Beautiful Mutants",
    author: "Deborah Levy",
    started: "2014-08-18",
    stopped: "2014-08-18",
    finished: true,
    id: {
      isbn: "0670828920",
    },
    links: [],
  },
  {
    title: "The Metamorphosis and Other Stories",
    author: "Franz Kafka",
    started: "2014-08-04",
    stopped: "2014-08-04",
    finished: true,
    id: {
      isbn: "1593080298",
    },
    links: [],
  },
  {
    title: "Art and Lies",
    author: "Jeanette Winterson",
    started: "2014-07-28",
    stopped: "",
    finished: true,
    id: {
      isbn: "0679762701",
    },
    links: [],
  },
  {
    title: "The Flame Alphabet",
    author: "Ben Marcus",
    started: "2014-07-22",
    stopped: "2014-07-22",
    finished: true,
    id: {
      isbn: "030737937X",
    },
    links: [],
  },
  {
    title: "C",
    author: "Tom McCarthy",
    started: "2014-07-15",
    stopped: "2014-07-15",
    finished: true,
    id: {
      isbn: "0307593339",
    },
    links: [],
  },
  {
    title: "The Yellow Wall-Paper",
    author: "Charlotte Perkins Gilman",
    started: "2014-07-04",
    stopped: "2014-07-03",
    finished: true,
    id: {
      isbn: "1558611584",
    },
    links: [],
  },
  {
    title: "Alice’s Adventures in Wonderland - Through the Looking-Glass",
    author: "Lewis Carroll",
    started: "2014-07-01",
    stopped: "2014-07-01",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "The Outsider",
    author: "Albert Camus",
    started: "2014-05-28",
    stopped: "2014-05-28",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "Paris France",
    author: "Gertrude Stein",
    started: "2014-05-16",
    stopped: "2014-05-16",
    finished: true,
    id: {
      isbn: "0720611970",
    },
    links: [],
  },
  {
    title: "Heading Inland",
    author: "Nicola Barker",
    started: "2014-04-26",
    stopped: "2014-04-25",
    finished: true,
    id: {
      isbn: "0571190529",
    },
    links: [],
  },
  {
    title: "For Richer, For Poorer: A Love Affair with Poker",
    author: "Victoria Coren",
    started: "2014-04-26",
    stopped: "2014-04-25",
    finished: true,
    id: {
      isbn: "1847672914",
    },
    links: [],
  },
  {
    title: "Sons and Lovers",
    author: "D.H. Lawrence",
    started: "2014-04-23",
    stopped: "2014-04-22",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "Five Miles from Outer Hope",
    author: "Nicola Barker",
    started: "2014-04-07",
    stopped: "2014-04-07",
    finished: true,
    id: {
      isbn: "057120595X",
    },
    links: [],
  },
  {
    title: "The Cement Garden",
    author: "Ian McEwan",
    started: "2014-04-05",
    stopped: "2014-04-04",
    finished: true,
    id: {
      isbn: "0099468387",
    },
    links: [],
  },
  {
    title: "Dirk Gently's Holistic Detective Agency (Dirk Gently, #1)",
    author: "Douglas Adams",
    started: "2014-03-31",
    stopped: "2014-03-31",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "Poor Things",
    author: "Alasdair Gray",
    started: "2014-03-28",
    stopped: "2014-03-27",
    finished: true,
    id: {
      isbn: "0747562288",
    },
    links: [],
  },
  {
    title: "The Waves",
    author: "Virginia Woolf",
    started: "2014-03-25",
    stopped: "2014-03-25",
    finished: true,
    id: {
      isbn: "0156949601",
    },
    links: [],
  },
  {
    title: "A Spy in the House of Love (Cities of the Interior, #4)",
    author: "Anaïs Nin",
    started: "2014-03-10",
    stopped: "2014-03-10",
    finished: true,
    id: {
      isbn: "0671871390",
    },
    links: [],
  },
  {
    title: "The King in Yellow and Other Horror Stories",
    author: "Robert W. Chambers",
    started: "2014-02-27",
    stopped: "2017-03-01",
    finished: true,
    id: {
      isbn: "0486437507",
    },
    links: [],
  },
  {
    title: "Bleeding Edge",
    author: "Thomas Pynchon",
    started: "2014-02-14",
    stopped: "2014-02-24",
    finished: true,
    id: {
      isbn: "1594204233",
    },
    links: [],
  },
  {
    title: "Judge Dredd: The Complete Case Files 05",
    author: "Alan Grant",
    started: "2014-02-14",
    stopped: "2014-02-12",
    finished: true,
    id: {
      isbn: "1905437080",
    },
    links: [],
  },
  {
    title: "The Blunders of Our Governments",
    author: "Anthony  King",
    started: "2014-02-06",
    stopped: "2017-03-01",
    finished: true,
    id: {
      isbn: "1780742665",
    },
    links: [],
  },
  {
    title: "Tropic of Cancer (Tropic, #1)",
    author: "Henry Miller",
    started: "2014-01-16",
    stopped: "2014-01-21",
    finished: true,
    id: {
      isbn: "0802131786",
    },
    links: [],
  },
  {
    title: "Wonder Boys",
    author: "Michael Chabon",
    started: "2014-01-16",
    stopped: "2014-01-16",
    finished: true,
    id: {
      isbn: "3423124172",
    },
    links: [],
  },
  {
    title: "Inherent Vice",
    author: "Thomas Pynchon",
    started: "2014-01-08",
    stopped: "2014-01-13",
    finished: true,
    id: {
      isbn: "1594202249",
    },
    links: [],
  },
  {
    title: "Keep the Aspidistra Flying",
    author: "George Orwell",
    started: "2014-01-05",
    stopped: "2014-01-05",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "V.",
    author: "Thomas Pynchon",
    started: "2013-12-06",
    stopped: "2013-12-30",
    finished: true,
    id: {
      isbn: "2020418770",
    },
    links: [],
  },
  {
    title: "The Spectre of Alexander Wolf",
    author: "Gaito Gazdanov",
    started: "2013-12-06",
    stopped: "2013-12-08",
    finished: true,
    id: {
      isbn: "1782270086",
    },
    links: [],
  },
  {
    title: "Gravity’s Rainbow",
    author: "Thomas Pynchon",
    started: "2013-11-26",
    stopped: "",
    finished: true,
    id: {
      isbn: "0143039946",
    },
    links: [],
  },
  {
    title: "A Girl Is a Half-Formed Thing",
    author: "Eimear McBride",
    started: "2013-10-31",
    stopped: "",
    finished: true,
    id: {
      isbn: "0957185324",
    },
    links: [],
  },
  {
    title: "Autobiography",
    author: "Morrissey",
    started: "2013-10-27",
    stopped: "",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "Bring Up the Bodies (Thomas Cromwell, #2)",
    author: "Hilary Mantel",
    started: "2013-09-06",
    stopped: "",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "Kafka on the Shore",
    author: "Haruki Murakami",
    started: "2013-08-31",
    stopped: "",
    finished: true,
    id: {
      isbn: "1400079276",
    },
    links: [],
  },
  {
    title: "Narcopolis",
    author: "Jeet Thayil",
    started: "2013-08-14",
    stopped: "",
    finished: true,
    id: {
      isbn: "0571275761",
    },
    links: [],
  },
  {
    title: "The Manhattan Projects, Vol. 1: Science. Bad.",
    author: "Jonathan Hickman",
    started: "2013-08-06",
    stopped: "",
    finished: true,
    id: {
      isbn: "1607066084",
    },
    links: [],
  },
  {
    title: "Haroun and the Sea of Stories (Khalifa Brothers, #1)",
    author: "Salman Rushdie",
    started: "2013-08-06",
    stopped: "",
    finished: true,
    id: {
      isbn: "0670886580",
    },
    links: [],
  },
  {
    title: "The Amazing Adventures of Kavalier & Clay",
    author: "Michael Chabon",
    started: "2013-08-01",
    stopped: "",
    finished: true,
    id: {
      isbn: "0312282990",
    },
    links: [],
  },
  {
    title: "A Feast for Crows (A Song of Ice and Fire, #4)",
    author: "George R.R. Martin",
    started: "2013-07-07",
    stopped: "",
    finished: true,
    id: {
      isbn: "055358202X",
    },
    links: [],
  },
  {
    title: "A Dance with Dragons (A Song of Ice and Fire, #5)",
    author: "George R.R. Martin",
    started: "2013-07-07",
    stopped: "",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "Something Leather",
    author: "Alasdair Gray",
    started: "2013-06-06",
    stopped: "",
    finished: true,
    id: {
      isbn: "0224026275",
    },
    links: [],
  },
  {
    title: "By Grand Central Station I Sat Down and Wept",
    author: "Elizabeth Smart",
    started: "2013-06-03",
    stopped: "",
    finished: true,
    id: {
      isbn: "0679738045",
    },
    links: [],
  },
  {
    title: "A Hologram for the King",
    author: "Dave Eggers",
    started: "2013-05-23",
    stopped: "",
    finished: true,
    id: {
      isbn: "193636574X",
    },
    links: [],
  },
  {
    title: "Homage to Catalonia",
    author: "George Orwell",
    started: "2013-03-30",
    stopped: "",
    finished: true,
    id: {
      isbn: "0156421178",
    },
    links: [],
  },
  {
    title: "At Home: A Short History of Private Life",
    author: "Bill Bryson",
    started: "2013-03-26",
    stopped: "",
    finished: true,
    id: {
      isbn: "0767919386",
    },
    links: [],
  },
  {
    title: "The History of Sexuality, Volume 1: An Introduction",
    author: "Michel Foucault",
    started: "2013-01-31",
    stopped: "",
    finished: true,
    id: {
      isbn: "0679724699",
    },
    links: [],
  },
  {
    title: "Norwegian Wood",
    author: "Haruki Murakami",
    started: "2013-01-09",
    stopped: "",
    finished: true,
    id: {
      isbn: "0375704027",
    },
    links: [],
  },
  {
    title: "The Loneliness of the Long-Distance Runner",
    author: "Alan Sillitoe",
    started: "2012-10-19",
    stopped: "",
    finished: true,
    id: {
      isbn: "0007255608",
    },
    links: [],
  },
  {
    title:
      "Fear and Loathing in Las Vegas: A Savage Journey to the Heart of the American Dream",
    author: "Hunter S. Thompson",
    started: "2012-10-17",
    stopped: "2014-04-27",
    finished: true,
    id: {
      isbn: "0679785892",
    },
    links: [],
  },
  {
    title: "Vernon God Little",
    author: "D.B.C. Pierre",
    started: "2012-10-17",
    stopped: "",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "Swimming Home",
    author: "Deborah Levy",
    started: "2012-10-17",
    stopped: "2012-11-09",
    finished: true,
    id: {
      isbn: "1908276029",
    },
    links: [],
  },
  {
    title: "Wolf Hall (Thomas Cromwell, #1)",
    author: "Hilary Mantel",
    started: "2012-10-16",
    stopped: "2012-12-09",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "Eeeee Eee Eeee",
    author: "Tao Lin",
    started: "2012-10-16",
    stopped: "2012-11-12",
    finished: true,
    id: {
      isbn: "1933633255",
    },
    links: [],
  },
  {
    title: "Mrs. Dalloway",
    author: "Virginia Woolf",
    started: "2012-09-24",
    stopped: "2012-10-21",
    finished: true,
    id: {
      isbn: "0151009988",
    },
    links: [],
  },
  {
    title:
      "A Storm of Swords 2: Blood and Gold (A Song of Ice and Fire, #3, Part 2 of 2)",
    author: "George R.R. Martin",
    started: "2012-08-08",
    stopped: "",
    finished: true,
    id: {
      isbn: "0007119550",
    },
    links: [],
  },
  {
    title: "A Storm of Swords: Steel and Snow (A Song of Ice and Fire, #3.1)",
    author: "George R.R. Martin",
    started: "2012-07-29",
    stopped: "2012-08-08",
    finished: true,
    id: {
      isbn: "0006479901",
    },
    links: [],
  },
  {
    title: "A Clash of Kings  (A Song of Ice and Fire, #2)",
    author: "George R.R. Martin",
    started: "2012-07-11",
    stopped: "2012-07-25",
    finished: true,
    id: {
      isbn: "0553381695",
    },
    links: [],
  },
  {
    title: "A Game of Thrones (A Song of Ice and Fire, #1)",
    author: "George R.R. Martin",
    started: "2012-06-25",
    stopped: "2012-07-11",
    finished: true,
    id: {
      isbn: "0553588486",
    },
    links: [],
  },
  {
    title: "Darkmans (Thames Gateway, #3)",
    author: "Nicola Barker",
    started: "2012-06-05",
    stopped: "2012-06-15",
    finished: true,
    id: {
      isbn: "0007193629",
    },
    links: [],
  },
  {
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    started: "2012-06-05",
    stopped: "",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "The Color of Magic (Discworld, #1; Rincewind, #1)",
    author: "Terry Pratchett",
    started: "2012-04-15",
    stopped: "",
    finished: true,
    id: {
      isbn: "0060855924",
    },
    links: [],
  },
  {
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "0307347974",
    },
    links: [],
  },
  {
    title: "Lord of the Flies",
    author: "William Golding",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "0140283331",
    },
    links: [],
  },
  {
    title: "A Clockwork Orange",
    author: "Anthony Burgess",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "One Hundred Years of Solitude",
    author: "Gabriel García Márquez",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "A Farewell to Arms",
    author: "Ernest Hemingway",
    started: "2012-04-11",
    stopped: "2015-03-05",
    finished: true,
    id: {
      isbn: "0099910101",
    },
    links: [],
  },
  {
    title: "Story of the Eye",
    author: "Georges Bataille",
    started: "2012-04-11",
    stopped: "2014-02-10",
    finished: true,
    id: {
      isbn: "0872862097",
    },
    links: [],
  },
  {
    title: "A Portrait of the Artist as a Young Man",
    author: "James Joyce",
    started: "2012-04-11",
    stopped: "2014-02-02",
    finished: true,
    id: {
      isbn: "0142437344",
    },
    links: [],
  },
  {
    title: "Lolita",
    author: "Vladimir Nabokov",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "0679723161",
    },
    links: [],
  },
  {
    title: "Slaughterhouse-Five",
    author: "Kurt Vonnegut Jr.",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "Sexing the Cherry",
    author: "Jeanette Winterson",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "0802135781",
    },
    links: [],
  },
  {
    title: "The Handmaid’s Tale (The Handmaid's Tale, #1)",
    author: "Margaret Atwood",
    started: "2012-04-11",
    stopped: "2012-10-28",
    finished: true,
    id: {
      isbn: "038549081X",
    },
    links: [],
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    started: "2012-04-11",
    stopped: "2012-06-29",
    finished: true,
    id: {
      isbn: "0060929871",
    },
    links: [],
  },
  {
    title: "Shriek: An Afterword (Ambergris, #2)",
    author: "Jeff VanderMeer",
    started: "2012-04-11",
    stopped: "2012-05-23",
    finished: true,
    id: {
      isbn: "0765314657",
    },
    links: [],
  },
  {
    title: "The Master and Margarita",
    author: "Mikhail Bulgakov",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "0679760806",
    },
    links: [],
  },
  {
    title: "The Brief Wondrous Life of Oscar Wao",
    author: "Junot Díaz",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "1594489580",
    },
    links: [],
  },
  {
    title: "Memoirs of a Geisha",
    author: "Arthur Golden",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "0739326228",
    },
    links: [],
  },
  {
    title: "Of Mice and Men",
    author: "John Steinbeck",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "0142000671",
    },
    links: [],
  },
  {
    title: "Catch-22",
    author: "Joseph Heller",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "0684833395",
    },
    links: [],
  },
  {
    title: "The Hobbit, or There and Back Again",
    author: "J.R.R. Tolkien",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "Animal Farm",
    author: "George Orwell",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "0743273567",
    },
    links: [],
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "0316769177",
    },
    links: [],
  },
  {
    title: "1984",
    author: "George Orwell",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "0060935464",
    },
    links: [],
  },
  {
    title: "The Bell Jar",
    author: "Sylvia Plath",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "0571268862",
    },
    links: [],
  },
  {
    title: "To the Lighthouse",
    author: "Virginia Woolf",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "The Secret Agent",
    author: "Joseph Conrad",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "0192801694",
    },
    links: [],
  },
  {
    title: "The Selected Works of T.S. Spivet",
    author: "Reif Larsen",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "1594202176",
    },
    links: [],
  },
  {
    title: "The Stars, Like Dust (Galactic Empire, #1)",
    author: "Isaac Asimov",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "0553293435",
    },
    links: [],
  },
  {
    title: "Battle Royale",
    author: "Koushun Takami",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "156931778X",
    },
    links: [],
  },
  {
    title: "The Hunger Games (The Hunger Games, #1)",
    author: "Suzanne Collins",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "0439023483",
    },
    links: [],
  },
  {
    title: "Down and Out in Paris and London",
    author: "George Orwell",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "015626224X",
    },
    links: [],
  },
  {
    title:
      "Banvard's Folly: Thirteen Tales of People Who Didn't Change the World",
    author: "Paul  Collins",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "0312300336",
    },
    links: [],
  },
  {
    title: "The Unbearable Lightness of Being",
    author: "Milan Kundera",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "0571224385",
    },
    links: [],
  },
  {
    title: "The Bloody Chamber and Other Stories",
    author: "Angela Carter",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "014017821X",
    },
    links: [],
  },
  {
    title:
      "So Long, and Thanks for All the Fish (Hitchhiker's Guide to the Galaxy, #4)",
    author: "Douglas Adams",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "0330491237",
    },
    links: [],
  },
  {
    title:
      "Life, the Universe and Everything (The Hitchhiker's Guide to the Galaxy, #3)",
    author: "Douglas Adams",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "0345418905",
    },
    links: [],
  },
  {
    title:
      "The Restaurant at the End of the Universe (The Hitchhiker's Guide to the Galaxy, #2)",
    author: "Douglas Adams",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title:
      "The Hitchhiker’s Guide to the Galaxy (Hitchhiker's Guide to the Galaxy, #1)",
    author: "Douglas Adams",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "The Time Machine",
    author: "H.G. Wells",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "Foundation (Foundation, #1)",
    author: "Isaac Asimov",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "0553803719",
    },
    links: [],
  },
  {
    title: "Necronomicon: The Best Weird Tales",
    author: "H.P. Lovecraft",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "0575081562",
    },
    links: [],
  },
  {
    title: "Far From the Madding Crowd",
    author: "Thomas Hardy",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "House of Leaves",
    author: "Mark Z. Danielewski",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "Oranges Are Not the Only Fruit",
    author: "Jeanette Winterson",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "",
    },
    links: [],
  },
  {
    title: "City of Saints and Madmen (Ambergris, #1)",
    author: "Jeff VanderMeer",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "0553383574",
    },
    links: [],
  },
  {
    title: "Ripening Seed (English and French Edition)",
    author: "Colette Gauthier-Villars",
    started: "2012-04-11",
    stopped: "",
    finished: true,
    id: {
      isbn: "0374250693",
    },
    links: [],
  },
];

const isOlid = (id: Isbn | Olid): id is Olid => (id as Olid).olid !== undefined;
const createImageLink = (id: { olid: string } | { isbn: string }) =>
  isOlid(id)
    ? `https://covers.openlibrary.org/b/olid/${id.olid}-L.jpg`
    : `https://covers.openlibrary.org/b/isbn/${id.isbn}-L.jpg`;

// If stopped date but not finished, then show it as unfinished.
// If finished, show it as finished.

export default function Library() {
  return (
    <div className="h-full library_background">
      <div className="body bg-white dark:bg-stone-800">
        <Link className="my-2" to="..">
          Go back
        </Link>
        <h1 className="text-8xl tracking-tighter">The library</h1>

        <details>
          <summary>What is this?</summary>
          <p className="mt-2 italic">
            A list of the books I am reading, or have read. Unfortunately very
            incomplete due to forgetfulness and lack of record keeping. Includes
            data imported from GoodReads which certainly has inaccurate dates.
          </p>
        </details>
        <ol>
          {library.map((entry, i) => (
            <li key={i} className="my-4">
              <div className="grid grid-cols-3 gap-4">
                <img
                  loading="lazy"
                  src={createImageLink(entry.id)}
                  alt={entry.title}
                  className="h-48"
                />
                <div className="col-span-2">
                  <h2 className="text-2xl">{entry.title}</h2>
                  <p>{entry.author}</p>
                  <p>{entry.started}</p>
                  {entry.stopped && <p>{entry.stopped}</p>}
                  {entry.finished && <p>Finished</p>}
                  {entry.links.length > 0 && (
                    <ul>
                      {entry.links.map((link, j) => (
                        <li key={j}>
                          <a href={link.url}>{link.title}</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
