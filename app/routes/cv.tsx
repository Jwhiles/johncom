export { headers } from "~/utils/headers";

export default function CV() {
  return (
    <div className="mx-auto max-w-4xl p-4 pb-16 pt-10 leading-tight [&:not(:last-child)]:*:mb-8 [&:not(:last-child)]:*:border-b-2 [&:not(:last-child)]:*:pb-8">
      <Profile />

      <WorkHistory />

      <Education />
    </div>
  );
}

const Profile = () => (
  <div className="grid grid-cols-5 gap-4 ">
    <h1 className="col-span-5 my-0 text-3xl md:col-span-1">John Whiles</h1>
    <div className="col-span-3">
      <p className="text-base">
        I am a product-minded software engineer with 8 years of experience
        working at high-growth companies.
      </p>

      <p className="text-base">I'm currently particularly interested in:</p>
      <ul className="my-0 ">
        <li>New forms of software enabled by LLMs</li>
        <li>
          Decentralized communication protocols like the AT Protocol,
          Microformats, and ActivityPub
        </li>
        <li>What comes after React</li>
      </ul>
    </div>

    <ul className="my-0 list-none">
      <li>
        <a href="https://github.com/jwhiles">Github</a>
      </li>
      <li>
        <a href="https://www.linkedin.com/in/john-whiles/">LinkedIn</a>
      </li>
      <li>
        <a href="https://johnwhiles.com">Website</a>
      </li>
      <li>
        <a href="mailto:cv@johnwhiles.com">Email</a>
      </li>
    </ul>
  </div>
);

const workHistory: Array<WorkEntryProps> = [
  {
    companyName: "Consensys",
    jobTitle: "Staff Software Engineer",
    technologies: ["TypeScript", "AWS", "Go"],
    startDate: "March 2024",
    endDate: "Present",
    experienceBulletPoints: [
      "I lead development on the Metamask developer dashboard.",
      "I am working with newly acquired companies and other Consensys teams to combine our various developer offerings into one coherent platform.",
      "I am leading hiring efforts to build out the Metamask developer team.",
    ],
  },
  {
    companyName: "Roost",
    jobTitle: "CTO",
    technologies: ["TypeScript", "Node.js", "Remix"],
    startDate: "September 2023",
    endDate: "December 2023",
    experienceBulletPoints: [
      "As part of the founding team was accepted onto Techstar’s London 2023 cohort.",
      "Was responsible for the initial technical direction of the company.",
      "Built MVPs of potential Roost products including services to help house sharers live harmoniously, and tools for identifying property investment opportunities.",
      "Worked closely with the CEO and COO to define the company’s strategy and direction.",
    ],
  },
  {
    companyName: "Contentful",
    jobTitle: "Senior Software Engineer",
    technologies: [
      "TypeScript",
      "Node.js",
      "React",
      "Go",
      "PostgreSQL",
      "Ruby on Rails",
    ],
    startDate: "March 2020",
    endDate: "September 2023",
    experienceBulletPoints: [
      <div key="app">
        I Was a key member of Contentful’s App Framework team.
        <ul className=" *:my-2 *:text-sm">
          <li>
            I built a hosting solution for Contentful Apps, enabling users to
            easily run their own code inside the Contentful web app.
          </li>
          <li>
            Built a system that allowed users to share their Apps with other
            organisations. This was a key feature to support enterprise users
            and open source App developers.
          </li>
          <li>
            I worked directly with enterprise customers who used the App
            Framework, both offering support with technical issues and gathering
            feedback to understand what new features we should build.
          </li>
        </ul>
      </div>,
      <div key="psql">
        Managed Contentful’s fleet of PostgreSQL databases which support 30% of
        Fortune 500 companies.{" "}
        <ul className=" *:my-2 *:text-sm">
          <li>
            Lead a project to perform major version upgrades across the entire
            fleet of hundreds of databases with zero downtime for customers.
          </li>
          <li>
            Maintained a custom Kubernetes operator, which ensured databases and
            supporting infrastructure were always in the correct state.
          </li>
        </ul>
      </div>,
      "Rebuilt the front-end technical interview, reducing the amount of time engineers spent in each interview by 40%.",
      "Helped junior engineers on-board successfully into the Company by providing mentorship and guidance.",
    ],
  },
  {
    companyName: "Soundcloud",
    jobTitle: "Frontend Engineer",
    technologies: ["JavaScript", "Backbone.js"],
    startDate: "June 2019",
    endDate: "March 2020",
    experienceBulletPoints: [
      "Worked on Soundcloud’s music publishing product, allowing users to publish their music to other platforms.",
      "Implemented a system that allowed users to tag each other in comments.",
      "Improved page load times on an internal admin tool by multiple orders of magnitude, which made it possible for a moderation team to achieve their goals.",
    ],
  },
  {
    companyName: "Habito",
    jobTitle: "Senior Software Engineer",
    technologies: ["Haskell", "PureScript", "React"],
    startDate: "July 2018",
    endDate: "June 2019",
    experienceBulletPoints: [
      "Built a design system which ensured accessibility and consistency across the entire product.",
      "Implemented the dynamic mortgage interview, which is the core of Habito’s user journey.",
      "As part of a two-person team, restyled Habito’s entire website in one month.",
    ],
  },
  {
    companyName: "Trainline",
    jobTitle: "Senior Software Engineer",
    technologies: ["TypeScript", "React", "Node.js"],
    startDate: "January 2018",
    endDate: "July 2018",
    experienceBulletPoints: [
      "Moved one of The Trainline’s busiest services from C# to Node.js, improving performance and maintainability.",
      "Improved The Trainline’s internal design system.",
    ],
  },
  {
    companyName: "Just Giving",
    jobTitle: "Senior Software Engineer",
    technologies: ["TypeScript", "React"],
    startDate: "March 2017",
    endDate: "January 2018",
    experienceBulletPoints: [
      "Built a rich UI for a new financial reporting service.",
      "Built a component library for the design system.",
      `Led a TypeScript migration, ensuring that builds continued to work, and helping the engineering team learn TypeScript.`,
    ],
  },
];

interface WorkEntryProps {
  companyName: string;
  jobTitle: string;
  technologies: Array<string>;
  startDate: string;
  endDate: string;
  experienceBulletPoints: Array<React.ReactNode>;
}

const WorkHistory = () => {
  return (
    <div className="grid grid-cols-9 gap-4">
      <div className="col-span-9 md:col-span-2">
        <h2 className="my-0 text-3xl">Professional Experience</h2>
      </div>
      <ol className="col-span-9 md:col-span-7">
        {workHistory.map((x) => (
          <WorkEntry key={x.companyName} {...x} />
        ))}
      </ol>
    </div>
  );
};

const WorkEntry = ({
  companyName,
  jobTitle,
  technologies,
  startDate,
  endDate,
  experienceBulletPoints,
}: WorkEntryProps) => {
  return (
    <div className="mb-4 grid grid-cols-6 gap-8 last:mb-0">
      <div className="col-span-2">
        <h3 className="mb-1 mt-0 text-xl">{companyName}</h3>
        <p className="mb-1 text-sm">{jobTitle}</p>
        <p className="text-xs">
          {startDate} - {endDate}
        </p>
        <ul className="ml-0 list-none">
          {technologies.map((x) => (
            <li key={x} className="my-1 text-xs text-slate-400">
              {x}
            </li>
          ))}
        </ul>
      </div>

      <div className="col-span-4">
        <ul className="my-0 *:my-2 *:text-sm">
          {experienceBulletPoints.map((x, i) => (
            <li key={i} className="my-1">
              {x}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Education = () => {
  return (
    <div className="grid grid-cols-9 gap-4">
      <div className="col-span-9 md:col-span-2">
        <h2 className="my-0 text-3xl">Education</h2>
      </div>

      <ol className="col-span-9 md:col-span-7">
        <div className="mb-4 grid grid-cols-6 gap-8">
          <div className="col-span-2">
            <h3 className="mb-1 mt-0 text-xl">Founders and Coders</h3>
            <p className="mb-0 text-xs">2016 - 2017</p>
          </div>

          <p className="col-span-4 text-base">Student developer</p>
        </div>

        <div className="grid grid-cols-6 gap-8">
          <div className="col-span-2">
            <h3 className="mb-1 mt-0 text-xl">
              Royal Holloway, University of London
            </h3>
            <p className="mb-0 text-xs">2010 - 2013</p>
          </div>

          <p className="col-span-4 text-base">
            BA Politics with Philosophy (2:1)
          </p>
        </div>
      </ol>
    </div>
  );
};

// const Skills = () => {
//   return (
//     <div className="grid grid-cols-9 gap-4">
//       <div className="col-span-2">
//         <h2 className="my-0 text-3xl">Skills</h2>
//       </div>

//       <ol className="col-span-7">
//         <li>TypeScript</li>
//         <li>React</li>
//       </ol>
//     </div>
//   );
// };
